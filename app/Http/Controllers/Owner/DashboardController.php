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

        // Helper to query owner's expenses (direct, group, or multi-unit)
        $ownerExpensesQuery = function () use ($user, $apartmentIds) {
            return Expense::where(function ($q) use ($user, $apartmentIds) {
                $q->where('user_id', $user->id)
                    ->orWhereIn('apartment_id', $apartmentIds)
                    ->orWhereHas('apartments', function ($sq) use ($apartmentIds) {
                        $sq->whereIn('apartments.id', $apartmentIds);
                    });
            });
        };

        // --- ONGOING MONTH FINANCIAL METRICS ---
        // Revenue attributed to check-out date (aligning with Booking.com payout schedule)
        $currentMonthRevenue = Booking::whereIn('apartment_id', $apartmentIds)
            ->where('status', '!=', 'cancelled')
            ->whereMonth('check_out_date', now()->month)
            ->whereYear('check_out_date', now()->year)
            ->sum('net_revenue');

        $currentMonthExpenses = $ownerExpensesQuery()
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('amount');

        $netEarnings = $currentMonthRevenue - $currentMonthExpenses;

        // --- DYNAMIC TRENDS (Month-over-Month) ---
        // Previous Month Data (Revenue attributed to checkout date)
        $previousMonthRevenue = Booking::whereIn('apartment_id', $apartmentIds)
            ->where('status', '!=', 'cancelled')
            ->whereMonth('check_out_date', now()->subMonth()->month)
            ->whereYear('check_out_date', now()->subMonth()->year)
            ->sum('net_revenue');

        $previousMonthExpenses = $ownerExpensesQuery()
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
        $totalBookings = Booking::whereIn('apartment_id', $apartmentIds)
            ->where('status', '!=', 'cancelled')
            ->whereMonth('check_in_date', now()->month)
            ->whereYear('check_in_date', now()->year)
            ->count();

        // Currently Occupied: any non-cancelled reservation whose stay period covers today,
        // regardless of whether the guest has submitted the check-in form yet.
        $activeStays = Booking::whereIn('apartment_id', $apartmentIds)
            ->where('status', '!=', 'cancelled')
            ->whereDate('check_in_date', '<=', now())
            ->whereDate('check_out_date', '>=', now())
            ->count();

        // Upcoming: all of this month's non-cancelled bookings with a check-in date after today.
        // Submitting the check-in form early flips status to "checked_in" but must not remove
        // the booking from this count, so status is intentionally not filtered here.
        $upcomingStays = Booking::whereIn('apartment_id', $apartmentIds)
            ->where('status', '!=', 'cancelled')
            ->whereDate('check_in_date', '>', now())
            ->whereMonth('check_in_date', now()->month)
            ->whereYear('check_in_date', now()->year)
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
                ->whereMonth('check_out_date', $date->month)
                ->whereYear('check_out_date', $date->year)
                ->sum('net_revenue');
            
            $monthlyRevenueData[] = [
                'month' => $monthName,
                'revenue' => (float)$revenue
            ];
        }

        return Inertia::render('Owner/Dashboard', [
            'stats' => [
                'total_revenue' => number_format($currentMonthRevenue, 2),
                'total_expenses' => number_format($currentMonthExpenses, 2),
                'net_earnings' => number_format($netEarnings, 2),
                'total_bookings' => $totalBookings,
                'active_stays' => $activeStays,
                'upcoming_stays' => $upcomingStays,
                'revenue_trend' => round($revenueTrend, 0),
                'expense_trend' => round($expenseTrend, 0),
                'ongoing_month' => now()->format('F Y'),
                'ongoing_month_name' => now()->format('F'),
            ],
            'recentBookings' => $recentBookings,
            'monthlyRevenue' => $monthlyRevenueData
        ]);
    }
}
