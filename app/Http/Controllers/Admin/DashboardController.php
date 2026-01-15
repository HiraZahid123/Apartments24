<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Apartment;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $today = now()->toDateString();
        $filter = $request->input('filter', 'all');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        // Build base query
        $query = Booking::with(['apartment']);

        // Apply status filter
        switch ($filter) {
            case 'active':
                $query->whereDate('check_in_date', '<=', $today)
                      ->whereDate('check_out_date', '>=', $today);
                break;
            case 'upcoming':
                $query->whereDate('check_in_date', '>', $today);
                break;
            case 'past':
                $query->whereDate('check_out_date', '<', $today);
                break;
            case 'today':
                $query->whereDate('check_in_date', $today);
                break;
            default:
                // Show active and upcoming by default
                $query->where(function ($q) use ($today) {
                    $q->where('check_in_date', $today)
                        ->orWhere(function ($sub) use ($today) {
                            $sub->where('check_in_date', '<=', $today)
                                ->where('check_out_date', '>=', $today);
                        })
                        ->orWhere('check_in_date', '>', $today);
                });
        }

        // Apply date range filter
        if ($dateFrom) {
            $query->whereDate('check_in_date', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('check_in_date', '<=', $dateTo);
        }

        // Order and get results
        $bookings = $query->orderByRaw("
                CASE 
                    WHEN check_in_date = ? THEN 1 
                    WHEN check_in_date <= ? AND check_out_date >= ? THEN 2
                    ELSE 3 
                END
            ", [$today, $today, $today])
            ->orderBy('check_in_date')
            ->get()
            ->map(function ($booking) use ($today) {
                $checkInDate = $booking->check_in_date;
                $checkOutDate = $booking->check_out_date;
                
                // Determine status
                $status = 'upcoming';
                if ($checkOutDate->isPast()) {
                    $status = 'past';
                } elseif ($checkInDate->isPast() || $checkInDate->isToday()) {
                    $status = 'active';
                }
                
                return [
                    'id' => $booking->id,
                    'apartment_name' => $booking->apartment->name,
                    'guest_name' => $booking->guest_name ?? $booking->guest_full_name ?? 'N/A',
                    'guest_email' => $booking->guest_email,
                    'check_in_date' => $checkInDate->format('Y-m-d'),
                    'check_out_date' => $checkOutDate->format('Y-m-d'),
                    'is_checked_in' => (bool)$booking->is_checked_in,
                    'checkin_form_sent' => (bool)$booking->checkin_form_sent,
                    'status' => $status,
                    'is_today' => $checkInDate->isToday(),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'bookings' => $bookings,
            'filters' => [
                'filter' => $filter,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'stats' => [
                'total_apartments' => Apartment::count(),
                'active_bookings' => Booking::whereDate('check_in_date', '<=', $today)
                    ->whereDate('check_out_date', '>=', $today)
                    ->count(),
                'todays_checkins' => Booking::whereDate('checked_in_at', $today)
                    ->where('is_checked_in', true)
                    ->count(),
                'pending_checkins' => Booking::where('is_checked_in', false)
                    ->whereDate('check_in_date', '<=', $today)
                    ->whereDate('check_out_date', '>=', $today)
                    ->count(),
            ]
        ]);
    }
}
