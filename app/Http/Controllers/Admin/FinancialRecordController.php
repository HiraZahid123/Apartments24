<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\ApartmentGroup;
use App\Models\Booking;
use App\Models\Expense;
use App\Models\User;
use App\Support\BookingFinancials;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialRecordController extends Controller
{
    /**
     * Display historical financial records across all owners, filtered by month and
     * owner / apartment group / apartment, so admins can pull a statement without
     * impersonating an owner.
     */
    public function index(Request $request)
    {
        $apartments = Apartment::with('apartmentGroup')->get(['id', 'name', 'apartment_group_id', 'owner_id']);
        $apartmentIds = $apartments->pluck('id')->toArray();

        $groups = ApartmentGroup::with(['apartments' => function ($q) {
                $q->select('id', 'name', 'apartment_group_id');
            }])
            ->get(['id', 'name']);

        $owners = User::where('user_type', 'owner')->orderBy('name')->get(['id', 'name']);

        // Filter parameters
        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);
        $entity = $request->input('entity', 'all'); // 'all', 'owner:{id}', 'group:{id}', 'apartment:{id}'

        $selectedOwnerId = null;
        $selectedGroupId = null;
        $selectedApartmentId = null;

        if (str_starts_with($entity, 'owner:')) {
            $selectedOwnerId = (int) substr($entity, 6);
        } elseif (str_starts_with($entity, 'group:')) {
            $selectedGroupId = (int) substr($entity, 6);
        } elseif (str_starts_with($entity, 'apartment:')) {
            $selectedApartmentId = (int) substr($entity, 10);
        }

        // Determine which apartment IDs apply
        if ($selectedApartmentId) {
            $filteredApartmentIds = [$selectedApartmentId];
        } elseif ($selectedGroupId) {
            $filteredApartmentIds = $apartments->where('apartment_group_id', $selectedGroupId)->pluck('id')->toArray();
        } elseif ($selectedOwnerId) {
            $filteredApartmentIds = $apartments->where('owner_id', $selectedOwnerId)->pluck('id')->toArray();
        } else {
            $filteredApartmentIds = $apartmentIds;
        }

        // 1. Fetch Bookings (attributing to the month of check_out_date)
        $bookings = Booking::with('apartment.owner')
            ->whereIn('apartment_id', $filteredApartmentIds)
            ->where('status', '!=', 'cancelled')
            ->whereMonth('check_out_date', $month)
            ->whereYear('check_out_date', $year)
            ->orderBy('check_out_date', 'asc')
            ->get();

        $totals = BookingFinancials::sumForCollection($bookings);
        $totalRevenue = $totals['total_revenue'];
        $netRevenue = $totals['net_revenue'];
        $adminCommission = $totals['admin_commission'];
        $serviceFees = $totals['service_fees'];

        // 2. Fetch Expenses
        $expensesQuery = Expense::with(['apartment', 'apartmentGroup', 'apartments', 'user'])
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->orderBy('date', 'desc');

        if ($selectedApartmentId) {
            $expensesQuery->where(function ($q) use ($selectedApartmentId) {
                $q->where('apartment_id', $selectedApartmentId)
                    ->orWhereHas('apartments', function ($sq) use ($selectedApartmentId) {
                        $sq->where('apartments.id', $selectedApartmentId);
                    });
            });
        } elseif ($selectedGroupId) {
            $expensesQuery->where(function ($q) use ($selectedGroupId, $filteredApartmentIds) {
                $q->where('apartment_group_id', $selectedGroupId)
                    ->orWhereIn('apartment_id', $filteredApartmentIds)
                    ->orWhereHas('apartments', function ($sq) use ($filteredApartmentIds) {
                        $sq->whereIn('apartments.id', $filteredApartmentIds);
                    });
            });
        } elseif ($selectedOwnerId) {
            $expensesQuery->where(function ($q) use ($selectedOwnerId, $filteredApartmentIds) {
                $q->where('user_id', $selectedOwnerId)
                    ->orWhereIn('apartment_id', $filteredApartmentIds)
                    ->orWhereHas('apartments', function ($sq) use ($filteredApartmentIds) {
                        $sq->whereIn('apartments.id', $filteredApartmentIds);
                    });
            });
        }
        // 'all' -> no additional filter, every expense in the period counts

        $expenses = $expensesQuery->get();
        $totalExpenses = (float) $expenses->sum('amount');
        $netEarnings = $netRevenue - $totalExpenses;

        // Map bookings for view
        $formattedBookings = $bookings->map(function ($booking) {
            $nights = $booking->check_in_date && $booking->check_out_date
                ? max(1, $booking->check_in_date->diffInDays($booking->check_out_date))
                : 0;

            $breakdown = BookingFinancials::breakdown($booking);

            return [
                'id' => $booking->id,
                'guest_name' => $booking->guest_name,
                'apartment_name' => $booking->apartment->name ?? 'N/A',
                'owner_name' => $booking->apartment->owner->name ?? 'N/A',
                'check_in' => $booking->check_in_date ? $booking->check_in_date->format('d M Y') : 'N/A',
                'check_out' => $booking->check_out_date ? $booking->check_out_date->format('d M Y') : 'N/A',
                'nights' => $nights,
                'total_price' => $breakdown['total_price'],
                'service_fee' => $breakdown['service_fee'],
                'admin_commission' => $breakdown['admin_management_fee'],
                'net_revenue' => $breakdown['net_revenue'],
                'status' => $booking->status,
            ];
        });

        // Map expenses for view
        $formattedExpenses = $expenses->map(function ($expense) {
            $group = $expense->apartmentGroup;
            $apartmentsList = $expense->apartments;
            $directApt = $expense->apartment;

            if ($group) {
                $displayName = $group->name;
            } elseif ($apartmentsList->count() > 1) {
                $displayName = $apartmentsList->pluck('name')->join(', ');
            } else {
                $displayName = $directApt?->name ?? ($apartmentsList->first()?->name ?? 'General Expense');
            }

            return [
                'id' => $expense->id,
                'description' => $expense->description,
                'target_name' => $displayName,
                'owner_name' => $expense->user->name ?? 'N/A',
                'amount' => (float) $expense->amount,
                'date' => $expense->date ? $expense->date->format('d M Y') : 'N/A',
                'proof_image_url' => $expense->proof_image ? asset('storage/' . $expense->proof_image) : null,
            ];
        });

        // Entity name for display
        $entityLabel = 'All Properties';
        if ($selectedApartmentId) {
            $apt = $apartments->firstWhere('id', $selectedApartmentId);
            $entityLabel = $apt ? $apt->name : 'Apartment';
        } elseif ($selectedGroupId) {
            $grp = $groups->firstWhere('id', $selectedGroupId);
            $entityLabel = $grp ? "Group: {$grp->name}" : 'Apartment Group';
        } elseif ($selectedOwnerId) {
            $owner = $owners->firstWhere('id', $selectedOwnerId);
            $entityLabel = $owner ? "Owner: {$owner->name}" : 'Owner';
        }

        $dateCarbon = Carbon::createFromDate($year, $month, 1);

        return Inertia::render('Admin/FinancialRecords/Index', [
            'financials' => [
                'year' => $year,
                'month' => $month,
                'month_name' => $dateCarbon->format('F'),
                'period_label' => $dateCarbon->format('F Y'),
                'entity_label' => $entityLabel,
                'total_revenue' => $totalRevenue,
                'admin_commission' => $adminCommission,
                'service_fees' => $serviceFees,
                'net_revenue' => $netRevenue,
                'total_expenses' => $totalExpenses,
                'net_earnings' => $netEarnings,
                'bookings_count' => $bookings->count(),
                'expenses_count' => $expenses->count(),
            ],
            'bookings' => $formattedBookings,
            'expenses' => $formattedExpenses,
            'filters' => [
                'year' => $year,
                'month' => $month,
                'entity' => $entity,
            ],
            'filterOptions' => [
                'apartments' => $apartments->map(fn($a) => ['id' => $a->id, 'name' => $a->name, 'group_id' => $a->apartment_group_id]),
                'groups' => $groups->map(fn($g) => [
                    'id' => $g->id,
                    'name' => $g->name,
                    'units_count' => $g->apartments->count()
                ]),
                'owners' => $owners->map(fn($o) => ['id' => $o->id, 'name' => $o->name]),
            ]
        ]);
    }

    /**
     * Export statement as PDF for the selected period and owner/group/apartment.
     */
    public function export(Request $request)
    {
        $apartments = Apartment::get(['id', 'name', 'apartment_group_id', 'owner_id']);
        $groups = ApartmentGroup::get(['id', 'name']);
        $owners = User::where('user_type', 'owner')->get(['id', 'name']);

        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);
        $entity = $request->input('entity', 'all');

        $selectedOwnerId = null;
        $selectedGroupId = null;
        $selectedApartmentId = null;

        if (str_starts_with($entity, 'owner:')) {
            $selectedOwnerId = (int) substr($entity, 6);
        } elseif (str_starts_with($entity, 'group:')) {
            $selectedGroupId = (int) substr($entity, 6);
        } elseif (str_starts_with($entity, 'apartment:')) {
            $selectedApartmentId = (int) substr($entity, 10);
        }

        if ($selectedApartmentId) {
            $filteredApartmentIds = [$selectedApartmentId];
        } elseif ($selectedGroupId) {
            $filteredApartmentIds = $apartments->where('apartment_group_id', $selectedGroupId)->pluck('id')->toArray();
        } elseif ($selectedOwnerId) {
            $filteredApartmentIds = $apartments->where('owner_id', $selectedOwnerId)->pluck('id')->toArray();
        } else {
            $filteredApartmentIds = $apartments->pluck('id')->toArray();
        }

        $bookings = Booking::with('apartment.owner')
            ->whereIn('apartment_id', $filteredApartmentIds)
            ->where('status', '!=', 'cancelled')
            ->whereMonth('check_out_date', $month)
            ->whereYear('check_out_date', $year)
            ->orderBy('check_out_date', 'asc')
            ->get();

        $totals = BookingFinancials::sumForCollection($bookings);
        $totalRevenue = $totals['total_revenue'];
        $netRevenue = $totals['net_revenue'];
        $adminCommission = $totals['admin_commission'];
        $serviceFees = $totals['service_fees'];

        $expensesQuery = Expense::with(['apartment', 'apartmentGroup', 'apartments', 'user'])
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->orderBy('date', 'desc');

        if ($selectedApartmentId) {
            $expensesQuery->where(function ($q) use ($selectedApartmentId) {
                $q->where('apartment_id', $selectedApartmentId)
                    ->orWhereHas('apartments', function ($sq) use ($selectedApartmentId) {
                        $sq->where('apartments.id', $selectedApartmentId);
                    });
            });
        } elseif ($selectedGroupId) {
            $expensesQuery->where(function ($q) use ($selectedGroupId, $filteredApartmentIds) {
                $q->where('apartment_group_id', $selectedGroupId)
                    ->orWhereIn('apartment_id', $filteredApartmentIds)
                    ->orWhereHas('apartments', function ($sq) use ($filteredApartmentIds) {
                        $sq->whereIn('apartments.id', $filteredApartmentIds);
                    });
            });
        } elseif ($selectedOwnerId) {
            $expensesQuery->where(function ($q) use ($selectedOwnerId, $filteredApartmentIds) {
                $q->where('user_id', $selectedOwnerId)
                    ->orWhereIn('apartment_id', $filteredApartmentIds)
                    ->orWhereHas('apartments', function ($sq) use ($filteredApartmentIds) {
                        $sq->whereIn('apartments.id', $filteredApartmentIds);
                    });
            });
        }

        $expenses = $expensesQuery->get();
        $totalExpenses = (float) $expenses->sum('amount');
        $netEarnings = $netRevenue - $totalExpenses;

        $dateCarbon = Carbon::createFromDate($year, $month, 1);
        $entityLabel = 'All Properties';
        if ($selectedApartmentId) {
            $apt = $apartments->firstWhere('id', $selectedApartmentId);
            $entityLabel = $apt ? $apt->name : 'Apartment';
        } elseif ($selectedGroupId) {
            $grp = $groups->firstWhere('id', $selectedGroupId);
            $entityLabel = $grp ? "Group: {$grp->name}" : 'Apartment Group';
        } elseif ($selectedOwnerId) {
            $owner = $owners->firstWhere('id', $selectedOwnerId);
            $entityLabel = $owner ? "Owner: {$owner->name}" : 'Owner';
        }

        $data = [
            'month' => $dateCarbon->format('F'),
            'year' => $year,
            'entity_label' => $entityLabel,
            'financials' => [
                'total_revenue' => $totalRevenue,
                'admin_commission' => $adminCommission,
                'service_fees' => $serviceFees,
                'owner_share' => $netRevenue,
                'expenses' => $totalExpenses,
                'net_earnings' => $netEarnings,
            ],
            'bookings' => $bookings,
            'expenses_list' => $expenses,
        ];

        $pdf = Pdf::loadView('pdf.admin-financial-record-statement', $data);
        $cleanMonth = $dateCarbon->format('M_Y');
        $cleanLabel = preg_replace('/[^A-Za-z0-9_\-]/', '_', $entityLabel);

        return $pdf->download("Financial_Statement_{$cleanLabel}_{$cleanMonth}.pdf");
    }
}
