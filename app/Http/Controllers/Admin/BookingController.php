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

        $bookings = Booking::with(['apartment', 'checkin'])
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
                    'apartment_name' => $booking->linked_apartment_names,
                    'guest_name' => $booking->guest_name,
                    'guest_email' => $booking->guest_email,
                    'check_in_date' => $booking->check_in_date->format('Y-m-d'),
                    'check_out_date' => $booking->check_out_date->format('Y-m-d'),
                    'number_of_guests' => $booking->number_of_guests,
                    'total_price' => $booking->total_price,
                    'service_fee' => $booking->service_fee,
                    'status' => $booking->status,
                    'is_checked_in' => $booking->is_checked_in,
                    'checkin_token' => $booking->checkin_token,
                    'checkin_form_sent' => $booking->checkin_form_sent,
                    'checkin_form_sent_at' => $booking->checkin_form_sent_at ? $booking->checkin_form_sent_at->diffForHumans() : null,
                    'guest_details' => $booking->checkin ? [
                        'first_name' => $booking->checkin->first_name,
                        'last_name' => $booking->checkin->last_name,
                        'dob' => $booking->checkin->date_of_birth ? $booking->checkin->date_of_birth->format('Y-m-d') : null,
                        'nationality' => $booking->checkin->nationality,
                        'document_type' => $booking->checkin->document_type,
                        'document_number' => $booking->checkin->document_number,
                        'identification_image' => $booking->checkin->identification_image,
                    ] : null,
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
        $apartments = Apartment::with('owner')->where('is_active', true)->orderBy('name')->get()->map(function($apt) {
            return [
                'id' => $apt->id,
                'name' => $apt->name,
                'owner_revenue_percentage' => $apt->owner ? $apt->owner->owner_revenue_percentage : 65.00
            ];
        });
        
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
            'apartment_ids' => 'required|array',
            'apartment_ids.*' => 'exists:apartments,id',
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'number_of_guests' => 'required|integer|min:1',
            'preferred_language' => 'required|in:en,et,ru',
            'total_price' => 'required|numeric|min:0',
            'service_fee' => 'nullable|numeric|min:0',
            'status' => 'required|in:confirmed,pending,cancelled',
            'disabled_automated_messages' => 'nullable|array',
            'disabled_automated_messages.*' => 'string|in:guest_registration,welcome,thank_you,checkout_reminder',
        ]);

        $count = 0;
        foreach ($validated['apartment_ids'] as $apartmentId) {
            $data = $validated;
            unset($data['apartment_ids']);
            $data['apartment_id'] = $apartmentId;

            $booking = Booking::create($data);
            $booking->load('apartment');
            $count++;

            // Notify Admins
            try {
                $admins = \App\Models\User::where('user_type', 'admin')->get();
                \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\NewBookingNotification($booking));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to send booking notification: ' . $e->getMessage());
            }

            // AUTOMATIC: Send check-in email with guest's preferred language
            $disabled = $booking->disabled_automated_messages ?? [];
            if (!in_array('guest_registration', $disabled)) {
                try {
                    Mail::to($booking->guest_email)->send(new CheckinLinkMail($booking, $booking->preferred_language));
                    
                    // Log the automated message
                    \App\Models\AutomatedMessageLog::logMessage(
                        $booking->id,
                        'guest_registration',
                        $booking->preferred_language,
                        $booking->guest_email,
                        true
                    );
                    
                    // Update tracking status
                    $booking->update([
                        'checkin_form_sent' => true,
                        'checkin_form_sent_at' => now(),
                    ]);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Failed to send automatic check-in email: ' . $e->getMessage());
                    
                    \App\Models\AutomatedMessageLog::logMessage(
                        $booking->id,
                        'guest_registration',
                        $booking->preferred_language,
                        $booking->guest_email,
                        false,
                        $e->getMessage()
                    );
                }
            }
        }

        return redirect()->route('admin.bookings.index')->with('success', $count . ' bookings created successfully!');
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        $booking->load(['apartment', 'checkins']);
        $apartments = Apartment::with('owner')->where('is_active', true)->orderBy('name')->get()->map(function($apt) {
            return [
                'id' => $apt->id,
                'name' => $apt->name,
                'owner_revenue_percentage' => $apt->owner ? $apt->owner->owner_revenue_percentage : 65.00
            ];
        });
        
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
            'service_fee' => 'nullable|numeric|min:0',
            'status' => 'required|in:confirmed,checked_in,checked_out,cancelled',
            // Invoice fields
            'wants_invoice' => 'boolean',
            'invoice_name' => 'nullable|string|max:255',
            'invoice_registration_code' => 'nullable|string|max:255',
            'invoice_address' => 'nullable|string',
            'invoice_vat_number' => 'nullable|string|max:255',
            'invoice_accommodated_guests' => 'nullable|string',
            'disabled_automated_messages' => 'nullable|array',
            'disabled_automated_messages.*' => 'string|in:guest_registration,welcome,thank_you,checkout_reminder',
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
            // Load apartment relationship
            $booking->load('apartment');
            
            // Send the email with guest's preferred language
            Mail::to($booking->guest_email)->send(new CheckinLinkMail($booking, $booking->preferred_language ?? 'en'));

            // Log the message
            \App\Models\AutomatedMessageLog::logMessage(
                $booking->id,
                'guest_registration',
                $booking->preferred_language ?? 'en',
                $booking->guest_email,
                true
            );

            // Update tracking status
            $booking->update([
                'checkin_form_sent' => true,
                'checkin_form_sent_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Check-in link sent successfully to ' . $booking->guest_email);
        } catch (\Exception $e) {
            \App\Models\AutomatedMessageLog::logMessage(
                $booking->id,
                'guest_registration',
                $booking->preferred_language ?? 'en',
                $booking->guest_email,
                false,
                $e->getMessage()
            );
            
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

    /**
     * Download the invoice for the booking.
     */
    public function downloadInvoice(Booking $booking)
    {
        $booking->load(['apartment', 'checkin']);

        $settings = \App\Models\Setting::whereIn('key', [
            'company_name',
            'company_address',
            'company_registration_code',
            'company_vat_number',
            'bank_account_details'
        ])->pluck('value', 'key')->toArray();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.invoice', [
            'booking' => $booking,
            'settings' => $settings,
            'language' => $booking->preferred_language ?? 'en'
        ]);

        return $pdf->download('invoice-' . str_pad($booking->id, 5, '0', STR_PAD_LEFT) . '.pdf');
    }

    /**
     * Resend the invoice to the guest email.
     */
    public function resendInvoice(Booking $booking)
    {
        try {
            $booking->load(['apartment', 'checkin']);
            
            \Illuminate\Support\Facades\Mail::to($booking->guest_email)
                ->send(new \App\Mail\GuestInvoiceMail($booking, $booking->preferred_language ?? 'en'));

            // Log the message
            \App\Models\AutomatedMessageLog::logMessage(
                $booking->id,
                'invoice',
                $booking->preferred_language ?? 'en',
                $booking->guest_email,
                true
            );

            return redirect()->back()->with('success', 'Invoice resent successfully to ' . $booking->guest_email);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to resend invoice: ' . $e->getMessage());
            
            \App\Models\AutomatedMessageLog::logMessage(
                $booking->id,
                'invoice',
                $booking->preferred_language ?? 'en',
                $booking->guest_email,
                false,
                $e->getMessage()
            );

            return redirect()->back()->with('error', 'Failed to resend invoice: ' . $e->getMessage());
        }
    }
}
