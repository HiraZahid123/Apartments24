<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Apartment;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        try {
            $query = $request->input('q', '');
            
            if (strlen($query) < 2) {
                return response()->json(['results' => []]);
            }

            $results = collect();

            // Search Bookings
            $bookings = Booking::with('apartment')
                ->where(function ($q) use ($query) {
                    $q->where('guest_name', 'like', "%{$query}%")
                      ->orWhere('guest_email', 'like', "%{$query}%")
                      ->orWhereHas('apartment', function ($sub) use ($query) {
                          $sub->where('name', 'like', "%{$query}%");
                      });
                })
                ->latest()
                ->take(5)
                ->get();

            foreach ($bookings as $booking) {
                $results->push([
                    'type' => 'booking',
                    'id' => $booking->id,
                    'title' => $booking->guest_name ?? 'Guest',
                    'subtitle' => ($booking->apartment->name ?? 'Unknown') . ' • ' . ($booking->check_in_date ? $booking->check_in_date->format('M d, Y') : ''),
                    'url' => route('admin.bookings.edit', $booking->id),
                ]);
            }

            // Search Apartments
            $apartments = Apartment::where('name', 'like', "%{$query}%")
                ->orWhere('city', 'like', "%{$query}%")
                ->orWhere('address', 'like', "%{$query}%")
                ->take(5)
                ->get();

            foreach ($apartments as $apartment) {
                $results->push([
                    'type' => 'apartment',
                    'id' => $apartment->id,
                    'title' => $apartment->name,
                    'subtitle' => $apartment->city ?? $apartment->address ?? 'No location',
                    'url' => route('admin.apartments.edit', $apartment->id),
                ]);
            }

            return response()->json(['results' => $results->take(8)->values()]);
            
        } catch (\Exception $e) {
            return response()->json(['results' => [], 'error' => $e->getMessage()], 200);
        }
    }
}

