<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Apartment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\CheckinLinkMail;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $bookings = Booking::with('apartment')
            ->when($search, function ($query, $search) {
                $query->where('guest_name', 'like', "%{$search}%")
                    ->orWhere('guest_email', 'like', "%{$search}%")
                    ->orWhereHas('apartment', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->orderBy('check_in_date', 'desc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'apartment_name' => $booking->apartment->name,
                    'guest_name' => $booking->guest_name,
                    'guest_email' => $booking->guest_email,
                    'check_in_date' => $booking->check_in_date->format('Y-m-d'),
                    'check_out_date' => $booking->check_out_date->format('Y-m-d'),
                    'total_price' => $booking->total_price,
                    'status' => $booking->status,
                    'is_checked_in' => $booking->is_checked_in,
                    'checkin_token' => $booking->checkin_token,
                    'checkin_form_sent' => $booking->checkin_form_sent,
                    'checkin_form_sent_at' => $booking->checkin_form_sent_at ? $booking->checkin_form_sent_at->diffForHumans() : null,
                ];
            });

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $apartments = Apartment::where('is_active', true)->orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('Admin/Bookings/Create', [
            'apartments' => $apartments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'apartment_id' => 'required|exists:apartments,id',
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'number_of_guests' => 'required|integer|min:1',
            'preferred_language' => 'required|in:en,et,ru',
            'total_price' => 'required|numeric|min:0',
            'status' => 'required|in:confirmed,pending,cancelled',
        ]);

        $booking = Booking::create($validated);

        // Notify Admins
        try {
            $admins = \App\Models\User::where('user_type', 'admin')->get();
            \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\NewBookingNotification($booking));
        } catch (\Exception $e) {
            // Log error but continue
            \Illuminate\Support\Facades\Log::error('Failed to send booking notification: ' . $e->getMessage());
        }

        return redirect()->route('admin.bookings.index')->with('success', 'Booking created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        $apartments = Apartment::where('is_active', true)->orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('Admin/Bookings/Edit', [
            'booking' => $booking,
            'apartments' => $apartments,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'apartment_id' => 'required|exists:apartments,id',
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'number_of_guests' => 'required|integer|min:1',
            'preferred_language' => 'required|in:en,et,ru',
            'total_price' => 'required|numeric|min:0',
            'status' => 'required|in:confirmed,checked_in,checked_out,cancelled',
        ]);

        $booking->update($validated);

        return redirect()->route('admin.bookings.index')->with('success', 'Booking updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        $booking->delete();

        return redirect()->route('admin.bookings.index')->with('success', 'Booking deleted successfully!');
    }

    /**
     * Send check-in form to guest (Placeholder for Phase 5)
     */
    public function sendCheckin(Booking $booking)
    {
        try {
            // Send the email
            Mail::to($booking->guest_email)->send(new CheckinLinkMail($booking));

            // Update tracking status
            $booking->update([
                'checkin_form_sent' => true,
                'checkin_form_sent_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Check-in link sent successfully to ' . $booking->guest_email);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to send email: ' . $e->getMessage());
        }
    }
    /**
     * Bulk delete bookings.
     */
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:bookings,id',
        ]);

        Booking::whereIn('id', $validated['ids'])->delete();

        return redirect()->back()->with('success', count($validated['ids']) . ' bookings deleted successfully!');
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:bookings,id',
            'status' => 'required|in:confirmed,pending,cancelled,checked_in,checked_out',
        ]);

        Booking::whereIn('id', $validated['ids'])->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', count($validated['ids']) . ' bookings updated successfully!');
    }
}
