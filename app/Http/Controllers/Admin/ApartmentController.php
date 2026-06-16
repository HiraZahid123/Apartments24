<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ApartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $apartments = Apartment::with('owner')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->get()
            ->map(function ($apartment) {
                return [
                    'id' => $apartment->id,
                    'name' => $apartment->name,
                    'city' => $apartment->city,
                    'owner_name' => $apartment->owner?->name ?? $apartment->owner_name ?? 'N/A',
                    'keybox_code' => $apartment->keybox_code,
                    'is_active' => $apartment->is_active,
                ];
            });

        return Inertia::render('Admin/Apartments/Index', [
            'apartments' => $apartments,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $owners = User::where('user_type', 'owner')->orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('Admin/Apartments/Create', [
            'owners' => $owners,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'instructions' => 'nullable|string',
            'instructions_et' => 'nullable|string',
            'instructions_ru' => 'nullable|string',
            'rental_terms' => 'nullable|string',
            'rental_terms_et' => 'nullable|string',
            'rental_terms_ru' => 'nullable|string',
            'arrival_url_en' => 'nullable|string',
            'arrival_url_et' => 'nullable|string',
            'arrival_url_ru' => 'nullable|string',
            'owner_id' => 'required|exists:users,id',
            'owner_name' => 'nullable|string|max:255',
            'keybox_code' => 'nullable|string|max:50',
            'smart_lock_code' => 'nullable|string|max:50',
            'wifi_ssid' => 'nullable|string|max:255',
            'wifi_password' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
            'bed_type' => 'nullable|string|max:255',
        ]);

        // Generate a random unique arrival URL if not provided
        $validated['arrival_url'] = Str::slug($validated['name']) . '-' . Str::random(8);

        Apartment::create($validated);

        return redirect()->route('admin.apartments.index')->with('success', 'Apartment created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Apartment $apartment)
    {
        $owners = User::where('user_type', 'owner')->orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('Admin/Apartments/Edit', [
            'apartment' => $apartment,
            'owners' => $owners,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Apartment $apartment)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'instructions' => 'nullable|string',
            'instructions_et' => 'nullable|string',
            'instructions_ru' => 'nullable|string',
            'rental_terms' => 'nullable|string',
            'rental_terms_et' => 'nullable|string',
            'rental_terms_ru' => 'nullable|string',
            'arrival_url_en' => 'nullable|string',
            'arrival_url_et' => 'nullable|string',
            'arrival_url_ru' => 'nullable|string',
            'owner_id' => 'required|exists:users,id',
            'owner_name' => 'nullable|string|max:255',
            'keybox_code' => 'nullable|string|max:50',
            'smart_lock_code' => 'nullable|string|max:50',
            'wifi_ssid' => 'nullable|string|max:255',
            'wifi_password' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
            'bed_type' => 'nullable|string|max:255',
        ]);

        $apartment->update($validated);

        return redirect()->route('admin.apartments.index')->with('success', 'Apartment updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Apartment $apartment)
    {
        $apartment->delete();

        return redirect()->route('admin.apartments.index')->with('success', 'Apartment deleted successfully!');
    }
}
