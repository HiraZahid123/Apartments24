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
        $apartments = $user->apartments()->get(['id', 'name']);

        return Inertia::render('Owner/Expenses/Create', [
            'apartments' => $apartments,
        ]);
    }

    /**
     * Store a newly created expense in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        $apartmentIds = $user->apartments()->pluck('id')->toArray();

        $validated = $request->validate([
            'apartment_id' => 'required|in:' . implode(',', $apartmentIds),
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'proof_image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('proof_image')) {
            $path = $request->file('proof_image')->store('expense_proofs', 'public');
            $validated['proof_image'] = $path;
        }

        Expense::create($validated);

        return redirect()->route('owner.expenses.index')->with('success', 'Expense logged successfully!');
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
