<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

use App\Models\Booking;
use App\Models\Expense;
use App\Models\Apartment;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $apartmentIds = $user->apartments()->pluck('id');

        // Financial Metrics (Total)
        $totalRevenue = Booking::whereIn('apartment_id', $apartmentIds)
            ->where('status', '!=', 'cancelled')
            ->sum('net_revenue');

        $totalExpenses = Expense::whereIn('apartment_id', $apartmentIds)
            ->sum('amount');

        $netEarnings = $totalRevenue - $totalExpenses;

        // --- DYNAMIC TRENDS (Month-over-Month) ---
        // Current Month Data
        $currentMonthRevenue = Booking::whereIn('apartment_id', $apartmentIds)
            ->where('status', '!=', 'cancelled')
            ->whereMonth('check_in_date', now()->month)
            ->whereYear('check_in_date', now()->year)
            ->sum('net_revenue');

        $currentMonthExpenses = Expense::whereIn('apartment_id', $apartmentIds)
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('amount');

        // Previous Month Data
        $previousMonthRevenue = Booking::whereIn('apartment_id', $apartmentIds)
            ->where('status', '!=', 'cancelled')
            ->whereMonth('check_in_date', now()->subMonth()->month)
            ->whereYear('check_in_date', now()->subMonth()->year)
            ->sum('net_revenue');

        $previousMonthExpenses = Expense::whereIn('apartment_id', $apartmentIds)
            ->whereMonth('date', now()->subMonth()->month)
            ->whereYear('date', now()->subMonth()->year)
            ->sum('amount');

        // Calculate Revenue Trend
        $revenueTrend = 0;
        if ($previousMonthRevenue > 0) {
            $revenueTrend = (($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100;
        } elseif ($currentMonthRevenue > 0) {
            $revenueTrend = 100; // 100% growth if prev was zero
        }

        // Calculate Expense Trend
        $expenseTrend = 0;
        if ($previousMonthExpenses > 0) {
            $expenseTrend = (($currentMonthExpenses - $previousMonthExpenses) / $previousMonthExpenses) * 100;
        } elseif ($currentMonthExpenses > 0) {
            $expenseTrend = 100;
        }

        // Statistics
        $totalBookings = Booking::whereIn('apartment_id', $apartmentIds)->count();
        $activeStays = Booking::whereIn('apartment_id', $apartmentIds)
            ->where('status', 'checked_in')
            ->count();
        
        $upcomingStays = Booking::whereIn('apartment_id', $apartmentIds)
            ->where('check_in_date', '>=', now())
            ->where('status', 'confirmed')
            ->count();

        // Recent Bookings
        $recentBookings = Booking::with('apartment')
            ->whereIn('apartment_id', $apartmentIds)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'guest_name' => $booking->guest_name,
                    'apartment_name' => $booking->apartment->name,
                    'check_in' => $booking->check_in_date->format('d M'),
                    'check_out' => $booking->check_out_date->format('d M'),
                    'revenue' => number_format($booking->net_revenue, 2),
                    'status' => $booking->status
                ];
            });

        // Monthly Revenue Data for Chart (Last 6 months)
        $monthlyRevenueData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthName = $date->format('M');
            $revenue = Booking::whereIn('apartment_id', $apartmentIds)
                ->where('status', '!=', 'cancelled')
                ->whereMonth('check_in_date', $date->month)
                ->whereYear('check_in_date', $date->year)
                ->sum('net_revenue');
            
            $monthlyRevenueData[] = [
                'month' => $monthName,
                'revenue' => (float)$revenue
            ];
        }

        return Inertia::render('Owner/Dashboard', [
            'stats' => [
                'total_revenue' => number_format($totalRevenue, 2),
                'total_expenses' => number_format($totalExpenses, 2),
                'net_earnings' => number_format($netEarnings, 2),
                'total_bookings' => $totalBookings,
                'active_stays' => $activeStays,
                'upcoming_stays' => $upcomingStays,
                'revenue_trend' => round($revenueTrend, 0),
                'expense_trend' => round($expenseTrend, 0),
            ],
            'recentBookings' => $recentBookings,
            'monthlyRevenue' => $monthlyRevenueData
        ]);
    }
}
