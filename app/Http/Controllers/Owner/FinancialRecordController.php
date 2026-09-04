<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\ApartmentGroup;
use App\Models\Booking;
use App\Models\Expense;
use App\Support\BookingFinancials;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialRecordController extends Controller
{
    /**
     * Display historical financial records filtered by month and apartment / apartment group.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $userApartments = $user->apartments()->with('apartmentGroup')->get(['id', 'name', 'apartment_group_id']);
        $userApartmentIds = $userApartments->pluck('id')->toArray();

        // Get groups that contain this owner's apartments
        $groupIds = $userApartments->pluck('apartment_group_id')->filter()->unique();
        $userGroups = ApartmentGroup::whereIn('id', $groupIds)
            ->with(['apartments' => function ($q) use ($user) {
                $q->where('owner_id', $user->id)->select('id', 'name', 'apartment_group_id');
            }])
            ->get(['id', 'name']);

        // Filter parameters
        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);
        $entity = $request->input('entity', 'all'); // 'all', 'group:{id}', 'apartment:{id}'

        // Parse entity selection
        $selectedGroupId = null;
        $selectedApartmentId = null;

        if (str_starts_with($entity, 'group:')) {
            $selectedGroupId = (int) substr($entity, 6);
        } elseif (str_starts_with($entity, 'apartment:')) {
            $selectedApartmentId = (int) substr($entity, 10);
        } elseif ($request->filled('apartment_id')) {
            $selectedApartmentId = (int) $request->input('apartment_id');
            $entity = "apartment:{$selectedApartmentId}";
        } elseif ($request->filled('apartment_group_id')) {
            $selectedGroupId = (int) $request->input('apartment_group_id');
            $entity = "group:{$selectedGroupId}";
        }

        // Determine which apartment IDs apply
        if ($selectedApartmentId && in_array($selectedApartmentId, $userApartmentIds)) {
            $filteredApartmentIds = [$selectedApartmentId];
        } elseif ($selectedGroupId) {
            $filteredApartmentIds = $userApartments->where('apartment_group_id', $selectedGroupId)->pluck('id')->toArray();
        } else {
            $filteredApartmentIds = $userApartmentIds;
        }

        // 1. Fetch Bookings (attributing to the month of check_out_date)
        $bookings = Booking::with('apartment')
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
        $expensesQuery = Expense::with(['apartment', 'apartmentGroup', 'apartments'])
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
        } else {
            $expensesQuery->where(function ($q) use ($user, $userApartmentIds) {
                $q->where('user_id', $user->id)
                    ->orWhereIn('apartment_id', $userApartmentIds)
                    ->orWhereHas('apartments', function ($sq) use ($userApartmentIds) {
                        $sq->whereIn('apartments.id', $userApartmentIds);
                    });
            });
        }

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
                'apartment_name' => $booking->apartment->name ?? 'N/A',
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
                'amount' => (float) $expense->amount,
                'date' => $expense->date ? $expense->date->format('d M Y') : 'N/A',
                'proof_image_url' => $expense->proof_image ? asset('storage/' . $expense->proof_image) : null,
            ];
        });

        // Entity name for display
        $entityLabel = 'All Properties';
        if ($selectedApartmentId) {
            $apt = $userApartments->firstWhere('id', $selectedApartmentId);
            $entityLabel = $apt ? $apt->name : 'Apartment';
        } elseif ($selectedGroupId) {
            $grp = $userGroups->firstWhere('id', $selectedGroupId);
            $entityLabel = $grp ? "Group: {$grp->name}" : 'Apartment Group';
        }

        $dateCarbon = Carbon::createFromDate($year, $month, 1);

        return Inertia::render('Owner/FinancialRecords/Index', [
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
                'owner_revenue_percentage' => (float) ($user->owner_revenue_percentage ?? 65),
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
                'apartments' => $userApartments->map(fn($a) => ['id' => $a->id, 'name' => $a->name, 'group_id' => $a->apartment_group_id]),
                'groups' => $userGroups->map(fn($g) => [
                    'id' => $g->id,
                    'name' => $g->name,
                    'units_count' => $g->apartments->count()
                ]),
            ]
        ]);
    }

    /**
     * Export statement as PDF for the selected period and apartment/group.
     */
    public function export(Request $request)
    {
        $user = auth()->user();
        $userApartments = $user->apartments()->with('apartmentGroup')->get(['id', 'name', 'apartment_group_id']);
        $userApartmentIds = $userApartments->pluck('id')->toArray();

        $groupIds = $userApartments->pluck('apartment_group_id')->filter()->unique();
        $userGroups = ApartmentGroup::whereIn('id', $groupIds)->get(['id', 'name']);

        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);
        $entity = $request->input('entity', 'all');

        $selectedGroupId = null;
        $selectedApartmentId = null;

        if (str_starts_with($entity, 'group:')) {
            $selectedGroupId = (int) substr($entity, 6);
        } elseif (str_starts_with($entity, 'apartment:')) {
            $selectedApartmentId = (int) substr($entity, 10);
        }

        if ($selectedApartmentId && in_array($selectedApartmentId, $userApartmentIds)) {
            $filteredApartmentIds = [$selectedApartmentId];
        } elseif ($selectedGroupId) {
            $filteredApartmentIds = $userApartments->where('apartment_group_id', $selectedGroupId)->pluck('id')->toArray();
        } else {
            $filteredApartmentIds = $userApartmentIds;
        }

        // Fetch bookings (attributed to checkout date)
        $bookings = Booking::with('apartment')
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

        // Fetch expenses
        $expensesQuery = Expense::with(['apartment', 'apartmentGroup', 'apartments'])
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
        } else {
            $expensesQuery->where(function ($q) use ($user, $userApartmentIds) {
                $q->where('user_id', $user->id)
                    ->orWhereIn('apartment_id', $userApartmentIds)
                    ->orWhereHas('apartments', function ($sq) use ($userApartmentIds) {
                        $sq->whereIn('apartments.id', $userApartmentIds);
                    });
            });
        }

        $expenses = $expensesQuery->get();
        $totalExpenses = (float) $expenses->sum('amount');
        $netEarnings = $netRevenue - $totalExpenses;

        $dateCarbon = Carbon::createFromDate($year, $month, 1);
        $entityLabel = 'All Properties';
        if ($selectedApartmentId) {
            $apt = $userApartments->firstWhere('id', $selectedApartmentId);
            $entityLabel = $apt ? $apt->name : 'Apartment';
        } elseif ($selectedGroupId) {
            $grp = $userGroups->firstWhere('id', $selectedGroupId);
            $entityLabel = $grp ? "Group: {$grp->name}" : 'Apartment Group';
        }

        $data = [
            'owner' => $user,
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

        $pdf = Pdf::loadView('pdf.owner-financial-statement', $data);
        $cleanMonth = $dateCarbon->format('M_Y');
        $cleanLabel = preg_replace('/[^A-Za-z0-9_\-]/', '_', $entityLabel);
        
        return $pdf->download("Financial_Statement_{$cleanLabel}_{$cleanMonth}.pdf");
    }
}
