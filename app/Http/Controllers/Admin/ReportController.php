<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Expense;
use App\Models\Apartment;
use App\Support\BookingFinancials;
use Illuminate\Http\Request;
use Carbon\Carbon;

use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);

        // --- Monthly Financials (Selected Period) ---
        // 1. Total Revenue, Admin Commission, and Owner Share
        // Revenue is recognized in the month of check_out_date (aligning with Booking.com payout schedule)
        $monthlyBookings = Booking::with('apartment')
            ->where('status', '!=', 'cancelled')
            ->whereMonth('check_out_date', $month)
            ->whereYear('check_out_date', $year)
            ->get();

        $monthlyTotals = BookingFinancials::sumForCollection($monthlyBookings);
        $monthlyTotalRevenue = $monthlyTotals['total_revenue'];
        $monthlyOwnerShare = $monthlyTotals['net_revenue'];
        $monthlyAdminCommission = $monthlyTotals['admin_commission'];
        $monthlyServiceFees = $monthlyTotals['service_fees'];

        // 3. Expenses
        $monthlyExpenses = Expense::whereMonth('date', $month)
            ->whereYear('date', $year)
            ->sum('amount');

        // --- Yearly Trend Data (Chart) ---
        $monthlyTrend = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthStart = Carbon::createFromDate($year, $i, 1);
            
            $monthBookings = Booking::where('status', '!=', 'cancelled')
                ->whereMonth('check_out_date', $i)
                ->whereYear('check_out_date', $year)
                ->get();

            $trendTotals = BookingFinancials::sumForCollection($monthBookings);

            $monthlyTrend[] = [
                'month' => $monthStart->format('M'),
                'total_revenue' => $trendTotals['total_revenue'],
                'admin_commission' => $trendTotals['admin_commission'],
                'owner_payout' => $trendTotals['net_revenue']
            ];
        }

        // --- Top Performing Apartments (Yearly) ---
        $topApartments = Apartment::withCount(['bookings' => function($query) use ($year) {
                $query->where('status', '!=', 'cancelled')
                      ->whereYear('check_out_date', $year);
            }])
            ->withSum(['bookings' => function($query) use ($year) {
                $query->where('status', '!=', 'cancelled')
                      ->whereYear('check_out_date', $year);
            }], 'total_price')
            ->orderByDesc('bookings_sum_total_price')
            ->take(5)
            ->get()
            ->map(function($apt) {
                return [
                    'name' => $apt->name,
                    'revenue' => $apt->bookings_sum_total_price ?? 0,
                    'bookings_count' => $apt->bookings_count
                ];
            });

        return Inertia::render('Admin/Reports/Index', [
            'financials' => [
                'year' => $year,
                'month' => Carbon::createFromDate($year, $month, 1)->format('F'),
                'total_revenue' => $monthlyTotalRevenue,
                'admin_commission' => $monthlyAdminCommission,
                'service_fees' => $monthlyServiceFees,
                'owner_share' => $monthlyOwnerShare,
                'expenses' => $monthlyExpenses, // Owner expenses
            ],
            'chartData' => $monthlyTrend,
            'topApartments' => $topApartments,
            'filters' => [
                'year' => (int)$year,
                'month' => (int)$month
            ]
        ]);
    }

    public function export(Request $request)
    {
        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);

        $bookings = Booking::with('apartment')
            ->where('status', '!=', 'cancelled')
            ->whereMonth('check_out_date', $month)
            ->whereYear('check_out_date', $year)
            ->get();

        $totals = BookingFinancials::sumForCollection($bookings);
        $totalRevenue = $totals['total_revenue'];
        $ownerShare = $totals['net_revenue'];
        $adminCommission = $totals['admin_commission'];
        $serviceFees = $totals['service_fees'];

        $expenses = Expense::with(['apartment', 'apartmentGroup', 'apartments'])
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->get();
        
        $totalExpenses = $expenses->sum('amount');

        $data = [
            'month' => Carbon::createFromDate($year, $month, 1)->format('F'),
            'year' => $year,
            'financials' => [
                'total_revenue' => $totalRevenue,
                'admin_commission' => $adminCommission,
                'service_fees' => $serviceFees,
                'owner_share' => $ownerShare,
                'expenses' => $totalExpenses,
            ],
            'bookings' => $bookings,
            'expenses_list' => $expenses
        ];

        $pdf = Pdf::loadView('pdf.financial-statement', $data);
        return $pdf->download('financial-statement-'.$year.'-'.$month.'.pdf');
    }
}
