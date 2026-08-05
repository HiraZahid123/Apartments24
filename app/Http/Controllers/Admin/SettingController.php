<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Display the settings dashboard.
     */
    public function index()
    {
        // Load settings related to company, invoices, and guest contact section
        $keys = [
            'company_name',
            'company_address',
            'company_registration_code',
            'company_vat_number',
            'bank_account_details',
            // Guest "Need Help?" contact section
            'contact_phone',
            'contact_email',
            'contact_description_en',
            'contact_description_et',
            'contact_description_ru',
            'contact_hours_en',
            'contact_hours_et',
            'contact_hours_ru',
        ];

        $settings = Setting::whereIn('key', $keys)->pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    /**
     * Update the settings in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.company_name' => 'nullable|string|max:255',
            'settings.company_address' => 'nullable|string|max:1000',
            'settings.company_registration_code' => 'nullable|string|max:255',
            'settings.company_vat_number' => 'nullable|string|max:255',
            'settings.bank_account_details' => 'nullable|string|max:2000',
            // Guest contact section
            'settings.contact_phone' => 'nullable|string|max:50',
            'settings.contact_email' => 'nullable|string|max:255',
            'settings.contact_description_en' => 'nullable|string|max:500',
            'settings.contact_description_et' => 'nullable|string|max:500',
            'settings.contact_description_ru' => 'nullable|string|max:500',
            'settings.contact_hours_en' => 'nullable|string|max:255',
            'settings.contact_hours_et' => 'nullable|string|max:255',
            'settings.contact_hours_ru' => 'nullable|string|max:255',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
