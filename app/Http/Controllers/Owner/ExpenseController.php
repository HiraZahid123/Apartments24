<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Apartment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the expenses.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $apartmentIds = $user->apartments()->pluck('id');
        $search = $request->input('search');

        $expenses = Expense::with('apartment')
            ->whereIn('apartment_id', $apartmentIds)
            ->when($search, function ($query, $search) {
                $query->where('description', 'like', "%{$search}%");
            })
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($expense) {
                return [
                    'id' => $expense->id,
                    'apartment_name' => $expense->apartment->name,
                    'description' => $expense->description,
                    'amount' => $expense->amount,
                    'date' => $expense->date ? $expense->date->format('Y-m-d') : null,
                    'proof_image_url' => $expense->proof_image ? asset('storage/' . $expense->proof_image) : null,
                ];
            });

        return Inertia::render('Owner/Expenses/Index', [
            'expenses' => $expenses,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new expense.
     */
    public function create()
    {
        $user = auth()->user();
        $apartments = $user->apartments()->get(['id', 'name', 'apartment_group_id']);
        
        // Pass groups that have apartments owned by this user
        $groupIds = $apartments->pluck('apartment_group_id')->filter()->unique();
        $groups = \App\Models\ApartmentGroup::whereIn('id', $groupIds)->get(['id', 'name']);

        return Inertia::render('Owner/Expenses/Create', [
            'apartments' => $apartments,
            'groups' => $groups,
        ]);
    }

    /**
     * Store a newly created expense in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        $userApartmentIds = $user->apartments()->pluck('id')->toArray();

        $validated = $request->validate([
            'apartment_ids' => 'required|array|min:1',
            'apartment_ids.*' => 'required|in:' . implode(',', $userApartmentIds),
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'proof_image' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('proof_image')) {
            $path = $request->file('proof_image')->store('expense_proofs', 'public');
        }

        $apartmentCount = count($validated['apartment_ids']);
        $splitAmount = $validated['amount'] / $apartmentCount;

        foreach ($validated['apartment_ids'] as $apartmentId) {
            Expense::create([
                'apartment_id' => $apartmentId,
                'description' => $validated['description'],
                'amount' => $splitAmount,
                'date' => $validated['date'],
                'proof_image' => $path,
            ]);
        }

        return redirect()->route('owner.expenses.index')->with('success', 'Expense(s) logged successfully!');
    }

    /**
     * Show the form for editing the specified expense.
     */
    public function edit(Expense $expense)
    {
        $user = auth()->user();
        $apartments = $user->apartments()->get(['id', 'name']);

        // Security check
        if (!in_array($expense->apartment_id, $apartments->pluck('id')->toArray())) {
            abort(403, 'Unauthorized action.');
        }

        // Include the proof_image URL if it exists
        $expenseData = $expense->toArray();
        $expenseData['proof_image_url'] = $expense->proof_image ? asset('storage/' . $expense->proof_image) : null;
        $expenseData['date'] = $expense->date ? $expense->date->format('Y-m-d') : null;

        return Inertia::render('Owner/Expenses/Edit', [
            'apartments' => $apartments,
            'expense' => $expenseData,
        ]);
    }

    /**
     * Update the specified expense in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        $user = auth()->user();
        $apartmentIds = $user->apartments()->pluck('id')->toArray();

        // Security check
        if (!in_array($expense->apartment_id, $apartmentIds)) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'apartment_id' => 'required|in:' . implode(',', $apartmentIds),
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'proof_image' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf|max:2048',
        ]);

        if ($request->hasFile('proof_image')) {
            $path = $request->file('proof_image')->store('expense_proofs', 'public');
            $validated['proof_image'] = $path;
        }

        $expense->update($validated);

        return redirect()->route('owner.expenses.index')->with('success', 'Expense updated successfully!');
    }

    /**
     * Remove the specified expense from storage.
     */
    public function destroy(Expense $expense)
    {
        $user = auth()->user();
        $apartmentIds = $user->apartments()->pluck('id')->toArray();

        // Security check
        if (!in_array($expense->apartment_id, $apartmentIds)) {
            abort(403, 'Unauthorized action.');
        }

        $expense->delete();

        return redirect()->route('owner.expenses.index')->with('success', 'Expense deleted successfully!');
    }
}
