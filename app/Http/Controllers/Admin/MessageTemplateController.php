<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MessageTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageTemplateController extends Controller
{
    /**
     * Display a listing of all message templates.
     */
    public function index()
    {
        $templates = MessageTemplate::orderBy('type')->orderBy('language')->get();

        return Inertia::render('Admin/MessageTemplates/Index', [
            'templates' => $templates,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MessageTemplate $messageTemplate)
    {
        return Inertia::render('Admin/MessageTemplates/Edit', [
            'template' => $messageTemplate,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MessageTemplate $messageTemplate)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'is_active' => 'required|boolean',
        ]);

        $messageTemplate->update($validated);

        return redirect()->route('admin.message-templates.index')
            ->with('success', 'Message template updated successfully!');
    }
}
