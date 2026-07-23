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
    public function show(Request $request, $token)
    {
        $booking = Booking::where('checkin_token', $token)->firstOrFail();
        $booking->load(['apartment', 'checkins']);
        $checkinsCount = $booking->checkins->count();

        // If guest limit is reached, always show success page
        if ($checkinsCount >= $booking->number_of_guests) {
            return redirect()->route('guest.checkin.success', ['token' => $token]);
        }

        // If main guest is already checked in and NOT explicitly adding another guest, show success
        if ($booking->is_checked_in && !$request->has('add_guest')) {
            return redirect()->route('guest.checkin.success', ['token' => $token]);
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
            'phone_number' => 'nullable|string|max:20',
            'purpose_of_travel' => 'nullable|in:vacation,business,other',
            'number_of_minors' => 'nullable|integer|min:0|max:10',
            'document_type' => 'required|string|in:passport,id_card,other',
            'document_number' => 'required|string|max:100',
            'identification_image' => 'nullable|image|max:10240', // Optional
            'signature_data' => 'required|string',
            'terms_accepted' => 'required|accepted',
            'wants_invoice' => 'nullable|boolean',
            'invoice_name' => 'required_if:wants_invoice,true|nullable|string|max:255',
            'invoice_registration_code' => 'nullable|string|max:255',
            'invoice_address' => 'nullable|string|max:1000',
            'invoice_vat_number' => 'nullable|string|max:255',
            'invoice_accommodated_guests' => 'nullable|string|max:1000',
        ]);

        // Store identification image if provided
        $idImagePath = null;
        if ($request->hasFile('identification_image')) {
            $idImagePath = $request->file('identification_image')->store('guest-ids', 'public');
        }

        // Create check-in record
        GuestCheckin::create([
            'booking_id' => $booking->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'date_of_birth' => $request->date_of_birth,
            'nationality' => $request->nationality,
            'phone_number' => $request->phone_number,
            'purpose_of_travel' => $request->purpose_of_travel,
            'number_of_minors' => $request->number_of_minors,
            'document_type' => $request->document_type,
            'document_number' => $request->document_number,
            'identification_image' => $idImagePath,
            'signature_data' => $request->signature_data,
            'verification_status' => 'pending',
        ]);

        // Update booking status if this is the first guest
        $isFirstCheckin = !$booking->is_checked_in;
        $bookingUpdates = [];
        if ($isFirstCheckin) {
            $bookingUpdates = [
                'is_checked_in' => true,
                'checked_in_at' => now(),
                'status' => 'checked_in'
            ];
        }

        // If invoice requested during check-in, save the details
        if ($request->wants_invoice) {
            $bookingUpdates = array_merge($bookingUpdates, [
                'wants_invoice' => true,
                'invoice_name' => $request->invoice_name,
                'invoice_registration_code' => $request->invoice_registration_code,
                'invoice_address' => $request->invoice_address,
                'invoice_vat_number' => $request->invoice_vat_number,
                'invoice_accommodated_guests' => $request->invoice_accommodated_guests,
            ]);
        }

        if (!empty($bookingUpdates)) {
            $booking->update($bookingUpdates);
        }

        // Notify Admins and Send Email (Email only on first check-in)
        try {
            if ($isFirstCheckin) {
                $admins = \App\Models\User::where('user_type', 'admin')->get();
                \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\GuestCheckinNotification($booking));
                
                // Send Guest Welcome Email with language support if not disabled
                $language = $booking->preferred_language ?? 'en';
                $disabled = $booking->disabled_automated_messages ?? [];
                
                if (!in_array('welcome', $disabled)) {
                    try {
                        Mail::to($booking->guest_email)->send(new GuestWelcomeMail($booking, $language));
                        
                        // Log the automated message
                        \App\Models\AutomatedMessageLog::logMessage(
                            $booking->id,
                            'welcome',
                            $language,
                            $booking->guest_email,
                            true
                        );
                    } catch (\Exception $e) {
                        \Illuminate\Support\Facades\Log::error('Failed to send welcome email: ' . $e->getMessage());
                        \App\Models\AutomatedMessageLog::logMessage(
                            $booking->id,
                            'welcome',
                            $booking->preferred_language ?? 'en',
                            $booking->guest_email,
                            false,
                            $e->getMessage()
                        );
                    }
                }
                
                // Send Invoice if requested
                if ($booking->wants_invoice) {
                    Mail::to($booking->guest_email)->send(new \App\Mail\GuestInvoiceMail($booking, $language));
                }
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send checkin notification / invoice: ' . $e->getMessage());
        }

        return redirect()->route('guest.checkin.success', ['token' => $token]);
    }

    /**
     * Display the success page with access codes.
     */
    public function success($token)
    {
        $booking = Booking::where('checkin_token', $token)
            ->with(['apartment', 'checkins', 'checkin'])
            ->firstOrFail();

        if (!$booking->is_checked_in) {
            return redirect()->route('guest.checkin', ['token' => $token]);
        }

        return Inertia::render('Guest/Success', [
            'booking' => $booking,
            'checkins_count' => $booking->checkins->count()
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
 
            // Send Guest Goodbye Email with language support if not disabled
            $disabled = $booking->disabled_automated_messages ?? [];
            if (!in_array('thank_you', $disabled)) {
                $language = $booking->preferred_language ?? 'en';
                try {
                    Mail::to($booking->guest_email)->send(new GuestGoodbyeMail($booking, $language));
                    
                    // Log the automated message
                    \App\Models\AutomatedMessageLog::logMessage(
                        $booking->id,
                        'thank_you',
                        $language,
                        $booking->guest_email,
                        true
                    );
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Failed to send goodbye email: ' . $e->getMessage());
                    \App\Models\AutomatedMessageLog::logMessage(
                        $booking->id,
                        'thank_you',
                        $booking->preferred_language ?? 'en',
                        $booking->guest_email,
                        false,
                        $e->getMessage()
                    );
                }
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send checkout notification: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'You have successfully checked out. Thank you for staying with us!');
    }
    /**
     * Display the digital guidebook.
     */
    public function guidebook($token)
    {
        $booking = Booking::where('checkin_token', $token)
            ->with(['apartment.guidebook'])
            ->firstOrFail();

        $apartment = $booking->apartment;
        $guidebook = $apartment->guidebook;

        // If no guidebook exists, initialize a default one for this apartment
        if (!$guidebook) {
            $guidebook = \App\Models\Guidebook::create([
                'apartment_id' => $apartment->id,
                'welcome_title' => ['en' => 'Welcome to ' . $apartment->name, 'et' => 'Tere tulemast ' . $apartment->name, 'ru' => 'Добро пожаловать в ' . $apartment->name],
                'welcome_message' => ['en' => 'We hope you have a pleasant stay.', 'et' => 'Loodame, et teil on meeldiv peatumine.', 'ru' => 'Мы надеемся, что ваше пребывание будет приятным.'],
                'sections' => []
            ]);
        }

        return Inertia::render('Guest/Guidebook', [
            'booking' => $booking,
            'apartment' => $apartment,
            'guidebook' => $guidebook
        ]);
    }
}
