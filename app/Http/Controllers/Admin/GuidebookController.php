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

        $validated = $request->validate([
            'welcome_title' => 'required|array',
            'welcome_message' => 'required|array',
            'banner_image' => 'nullable|image|max:10240',
            'sections' => 'required|array',
        ]);

        if ($request->hasFile('banner_image')) {
            // Delete old image if exists
            if ($guidebook->banner_image) {
                Storage::disk('public')->delete($guidebook->banner_image);
            }
            $validated['banner_image'] = $request->file('banner_image')->store('guidebooks', 'public');
        } else {
            // Keep existing image if not provided
            unset($validated['banner_image']);
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
            foreach ($section['items'] as $iIndex => &$item) {
                if (!isset($files['sections'][$sIndex]['items'][$iIndex]['image'])) {
                    $oldItem = collect($oldSections)->flatMap(fn($s) => $s['items'] ?? [])->firstWhere('id', $item['id']);
                    if ($oldItem && isset($oldItem['image'])) {
                        if (isset($item['image']) && is_string($item['image'])) {
                            $item['image'] = $oldItem['image'];
                        } else {
                            // explicit remove or not kept
                            $item['image'] = null;
                        }
                    } else {
                        $item['image'] = null;
                    }
                }
            }
        }

        $validated['sections'] = $sections;

        $guidebook->update($validated);

        return redirect()->back()->with('success', 'Guidebook updated successfully!');
    }
}
