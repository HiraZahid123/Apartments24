<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\Guidebook;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GuidebookController extends Controller
{
    /**
     * Show the guidebook editor for an apartment.
     */
    public function edit(Apartment $apartment)
    {
        $guidebook = $apartment->guidebook;

        if (!$guidebook) {
            $guidebook = Guidebook::create([
                'apartment_id' => $apartment->id,
                'welcome_title' => ['en' => 'Welcome to ' . $apartment->name, 'et' => 'Tere tulemast ' . $apartment->name, 'ru' => 'Добро пожаловать в ' . $apartment->name],
                'welcome_message' => ['en' => 'We hope you have a pleasant stay.', 'et' => 'Loodame, et teil on meeldiv peatumine.', 'ru' => 'Мы надеемся, что ваше пребывание будет приятным.'],
                'sections' => []
            ]);
        }

        return Inertia::render('Admin/Guidebooks/Edit', [
            'apartment' => $apartment,
            'guidebook' => $guidebook
        ]);
    }

    /**
     * Update the guidebook for an apartment.
     */
    public function update(Request $request, Apartment $apartment)
    {
        $guidebook = $apartment->guidebook;

        if (!$guidebook) {
            $guidebook = Guidebook::create(['apartment_id' => $apartment->id, 'sections' => []]);
        }

        // "sections" must stay nullable: a guidebook with no sections is serialized
        // as an empty array, which multipart/form-data drops entirely — "required"
        // would then reject the whole save, banner image included.
        $validated = $request->validate([
            'welcome_title' => 'required|array',
            'welcome_message' => 'required|array',
            'banner_image' => 'nullable|image|max:10240',
            'banner_image_removed' => 'nullable|boolean',
            'sections' => 'nullable|array',
        ]);

        if ($request->hasFile('banner_image')) {
            // Delete old image if exists
            if ($guidebook->banner_image) {
                Storage::disk('public')->delete($guidebook->banner_image);
            }
            $validated['banner_image'] = $request->file('banner_image')->store('guidebooks', 'public');
        } else {
            // Check if banner image was explicitly removed
            if ($request->boolean('banner_image_removed')) {
                if ($guidebook->banner_image) {
                    Storage::disk('public')->delete($guidebook->banner_image);
                }
                $validated['banner_image'] = null;
            } else {
                // Keep existing image if not provided
                unset($validated['banner_image']);
            }
        }

        $sections = $request->input('sections', []);
        $files = $request->allFiles();

        if (isset($files['sections'])) {
            foreach ($files['sections'] as $sIndex => $sectionData) {
                if (isset($sectionData['items'])) {
                    foreach ($sectionData['items'] as $iIndex => $itemData) {
                        if (isset($itemData['image'])) {
                            $path = $itemData['image']->store('guidebooks/items', 'public');
                            $sections[$sIndex]['items'][$iIndex]['image'] = $path;
                        }
                    }
                }
            }
        }

        // Keep old item images if not explicitly removed or replaced
        $oldSections = $guidebook->sections ?? [];
        foreach ($sections as $sIndex => &$section) {
            // A section with no items is dropped from the form data, so the key may be absent
            $section['items'] = $section['items'] ?? [];

            foreach ($section['items'] as $iIndex => &$item) {
                if (!isset($files['sections'][$sIndex]['items'][$iIndex]['image'])) {
                    // No new file was uploaded for this item — always preserve the existing image from DB
                    $oldItem = collect($oldSections)->flatMap(fn($s) => $s['items'] ?? [])->firstWhere('id', $item['id']);
                    $item['image'] = $oldItem['image'] ?? null;
                }
                // If the item has image_removed flag set, explicitly clear the image
                if (isset($item['image_removed']) && $item['image_removed']) {
                    if (isset($item['image']) && is_string($item['image'])) {
                        Storage::disk('public')->delete($item['image']);
                    }
                    $item['image'] = null;
                }
                unset($item['image_removed']);
            }
            unset($item);
        }
        unset($section);

        $validated['sections'] = $sections;

        // Remove the helper flag — it should not be persisted to the database
        unset($validated['banner_image_removed']);

        $guidebook->update($validated);

        return redirect()->back()->with('success', 'Guidebook updated successfully!');
    }
}
