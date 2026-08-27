<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ApartmentGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApartmentGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $groups = ApartmentGroup::withCount('apartments')->get();
        return Inertia::render('Admin/ApartmentGroups/Index', [
            'groups' => $groups
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/ApartmentGroups/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:apartment_groups',
        ]);

        ApartmentGroup::create($validated);

        return redirect()->route('admin.apartment-groups.index')->with('success', 'Apartment Group created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ApartmentGroup $apartmentGroup)
    {
        return Inertia::render('Admin/ApartmentGroups/Edit', [
            'group' => $apartmentGroup
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ApartmentGroup $apartmentGroup)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:apartment_groups,name,' . $apartmentGroup->id,
        ]);

        $apartmentGroup->update($validated);

        return redirect()->route('admin.apartment-groups.index')->with('success', 'Apartment Group updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ApartmentGroup $apartmentGroup)
    {
        $apartmentGroup->delete();

        return redirect()->route('admin.apartment-groups.index')->with('success', 'Apartment Group deleted successfully.');
    }
}
