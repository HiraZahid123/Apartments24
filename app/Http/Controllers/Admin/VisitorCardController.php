<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class VisitorCardController extends Controller
{
    /**
     * Display the visitor card generation interface.
     */
    public function index()
    {
        $apartments = Apartment::orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('Admin/VisitorCards', [
            'apartments' => $apartments,
        ]);
    }

    /**
     * Generate and download the visitor card PDF.
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'apartment_id' => 'required|exists:apartments,id',
            'month' => 'required|date_format:Y-m',
        ]);

        $apartment = Apartment::findOrFail($validated['apartment_id']);
        $yearMonth = explode('-', $validated['month']);
        
        $bookings = Booking::where('apartment_id', $apartment->id)
            ->whereYear('check_in_date', $yearMonth[0])
            ->whereMonth('check_in_date', $yearMonth[1])
            ->where('is_checked_in', true)
            ->with(['checkins'])
            ->get();

        if ($bookings->isEmpty()) {
            return redirect()->back()->with('error', 'No check-ins found for the selected month.');
        }

        $pdf = Pdf::loadView('pdf.visitor-card', [
            'apartment' => $apartment,
            'bookings' => $bookings,
            'month' => $validated['month'],
        ]);

        return $pdf->download("Visitor_Cards_{$apartment->name}_{$validated['month']}.pdf");
    }
}
