<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\GuestCheckin;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\GuestWelcomeMail;
use App\Mail\GuestGoodbyeMail;

class CheckinController extends Controller
{
    /**
     * Display the guest check-in form.
     */
    public function show($token)
    {
        $booking = Booking::where('checkin_token', $token)
            ->with('apartment')
            ->firstOrFail();

        if ($booking->is_checked_in) {
            return Inertia::render('Guest/Success', [
                'booking' => $booking->load('apartment'),
                'already_checked_in' => true
            ]);
        }

        return Inertia::render('Guest/CheckinForm', [
            'booking' => $booking
        ]);
    }

    /**
     * Store the guest check-in data.
     */
    public function store(Request $request, $token)
    {
        $booking = Booking::where('checkin_token', $token)->firstOrFail();

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'nationality' => 'required|string|max:255',
            'document_type' => 'required|string|in:passport,id_card,other',
            'document_number' => 'required|string|max:100',
            'identification_image' => 'required|image|max:10240', // 10MB max
            'signature_data' => 'required|string',
        ]);

        // Store identification image
        $idImagePath = $request->file('identification_image')->store('guest-ids', 'public');

        // Create check-in record
        GuestCheckin::create([
            'booking_id' => $booking->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'date_of_birth' => $request->date_of_birth,
            'nationality' => $request->nationality,
            'document_type' => $request->document_type,
            'document_number' => $request->document_number,
            'identification_image' => $idImagePath,
            'signature_data' => $request->signature_data,
            'verification_status' => 'pending',
        ]);

        // Update booking status
        $booking->update([
            'is_checked_in' => true,
            'checked_in_at' => now(),
            'status' => 'checked_in'
        ]);

        // Notify Admins
        try {
            $admins = \App\Models\User::where('user_type', 'admin')->get();
            \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\GuestCheckinNotification($booking));
            
            // Send Guest Welcome Email
            Mail::to($booking->guest_email)->send(new GuestWelcomeMail($booking));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send checkin notification: ' . $e->getMessage());
        }

        return redirect()->route('guest.checkin.success', ['token' => $token]);
    }

    /**
     * Display the success page with access codes.
     */
    public function success($token)
    {
        $booking = Booking::where('checkin_token', $token)
            ->with(['apartment', 'checkin'])
            ->firstOrFail();

        if (!$booking->is_checked_in) {
            return redirect()->route('guest.checkin', ['token' => $token]);
        }

        return Inertia::render('Guest/Success', [
            'booking' => $booking
        ]);
    }

    /**
     * Handle the guest check-out notification.
     */
    public function checkout($token)
    {
        $booking = Booking::where('checkin_token', $token)->firstOrFail();

        if ($booking->is_checked_out) {
            return redirect()->back()->with('error', 'Already checked out.');
        }

        $booking->update([
            'is_checked_out' => true,
            'checked_out_at' => now(),
            'status' => 'checked_out'
        ]);

        // Notify Admins
        try {
            $admins = \App\Models\User::where('user_type', 'admin')->get();
            \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\GuestCheckoutNotification($booking));

            // Send Guest Goodbye Email
            Mail::to($booking->guest_email)->send(new GuestGoodbyeMail($booking));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send checkout notification: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'You have successfully checked out. Thank you for staying with us!');
    }
}
