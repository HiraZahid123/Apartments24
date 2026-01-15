<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Expense;
use App\Models\Apartment;
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
        // 1. Total Revenue (Total Price of bookings check-in this month)
        // Note: We use check_in_date for revenue recognition in this simple model
        $monthlyBookings = Booking::with('apartment')
            ->where('status', '!=', 'cancelled')
            ->whereMonth('check_in_date', $month)
            ->whereYear('check_in_date', $year)
            ->get();

        $monthlyTotalRevenue = $monthlyBookings->sum('total_price');
        
        $monthlyOwnerShare = $monthlyBookings->sum('net_revenue');
        $monthlyAdminCommission = $monthlyTotalRevenue - $monthlyOwnerShare;

        // 3. Expenses
        $monthlyExpenses = Expense::whereMonth('date', $month)
            ->whereYear('date', $year)
            ->sum('amount');

        // --- Yearly Trend Data (Chart) ---
        $monthlyTrend = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthStart = Carbon::createFromDate($year, $i, 1);
            
            $monthBookings = Booking::where('status', '!=', 'cancelled')
                ->whereMonth('check_in_date', $i)
                ->whereYear('check_in_date', $year)
                ->get();

            $total = $monthBookings->sum('total_price');
            $ownerShare = $monthBookings->sum('net_revenue');
            $adminShare = $total - $ownerShare;

            $monthlyTrend[] = [
                'month' => $monthStart->format('M'),
                'total_revenue' => $total,
                'admin_commission' => $adminShare,
                'owner_payout' => $ownerShare
            ];
        }

        // --- Top Performing Apartments (Yearly) ---
        $topApartments = Apartment::withCount(['bookings' => function($query) use ($year) {
                $query->where('status', '!=', 'cancelled')
                      ->whereYear('check_in_date', $year);
            }])
            ->withSum(['bookings' => function($query) use ($year) {
                $query->where('status', '!=', 'cancelled')
                      ->whereYear('check_in_date', $year);
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
            ->whereMonth('check_in_date', $month)
            ->whereYear('check_in_date', $year)
            ->get();

        $totalRevenue = $bookings->sum('total_price');
        $ownerShare = $bookings->sum('net_revenue');
        $adminCommission = $totalRevenue - $ownerShare;

        $expenses = Expense::with('apartment')
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
