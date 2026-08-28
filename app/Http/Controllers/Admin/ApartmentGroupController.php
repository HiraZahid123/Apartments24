<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
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
        $apartments = Apartment::orderBy('name')->get(['id', 'name', 'apartment_group_id', 'owner_name']);

        return Inertia::render('Admin/ApartmentGroups/Create', [
            'apartments' => $apartments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255|unique:apartment_groups',
            'apartment_ids'  => 'nullable|array',
            'apartment_ids.*' => 'integer|exists:apartments,id',
        ]);

        $group = ApartmentGroup::create(['name' => $validated['name']]);

        $apartmentIds = $validated['apartment_ids'] ?? [];

        // Remove this group from any apartment that was previously in it (shouldn't be any for new groups)
        Apartment::where('apartment_group_id', $group->id)
            ->whereNotIn('id', $apartmentIds)
            ->update(['apartment_group_id' => null]);

        // Assign the selected apartments to this group
        if (!empty($apartmentIds)) {
            Apartment::whereIn('id', $apartmentIds)
                ->update(['apartment_group_id' => $group->id]);
        }

        return redirect()->route('admin.apartment-groups.index')->with('success', 'Apartment Group created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ApartmentGroup $apartmentGroup)
    {
        $apartments = Apartment::orderBy('name')->get(['id', 'name', 'apartment_group_id', 'owner_name']);

        return Inertia::render('Admin/ApartmentGroups/Edit', [
            'group'      => $apartmentGroup,
            'apartments' => $apartments,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ApartmentGroup $apartmentGroup)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255|unique:apartment_groups,name,' . $apartmentGroup->id,
            'apartment_ids'   => 'nullable|array',
            'apartment_ids.*' => 'integer|exists:apartments,id',
        ]);

        $apartmentGroup->update(['name' => $validated['name']]);

        $apartmentIds = $validated['apartment_ids'] ?? [];

        // Remove group from apartments that were deselected
        Apartment::where('apartment_group_id', $apartmentGroup->id)
            ->whereNotIn('id', $apartmentIds)
            ->update(['apartment_group_id' => null]);

        // Assign the selected apartments to this group
        if (!empty($apartmentIds)) {
            Apartment::whereIn('id', $apartmentIds)
                ->update(['apartment_group_id' => $apartmentGroup->id]);
        }

        return redirect()->route('admin.apartment-groups.index')->with('success', 'Apartment Group updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ApartmentGroup $apartmentGroup)
    {
        // Unlink apartments from this group before deleting
        Apartment::where('apartment_group_id', $apartmentGroup->id)
            ->update(['apartment_group_id' => null]);

        $apartmentGroup->delete();

        return redirect()->route('admin.apartment-groups.index')->with('success', 'Apartment Group deleted successfully.');
    }
}
