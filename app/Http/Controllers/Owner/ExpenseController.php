<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Apartment;
use App\Models\ApartmentGroup;
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
        $apartmentIds = $user->apartments()->pluck('id')->toArray();
        $search = $request->input('search');

        $expenses = Expense::with(['apartment', 'apartmentGroup', 'apartments'])
            ->where(function ($query) use ($user, $apartmentIds) {
                $query->where('user_id', $user->id)
                    ->orWhereIn('apartment_id', $apartmentIds)
                    ->orWhereHas('apartments', function ($q) use ($apartmentIds) {
                        $q->whereIn('apartments.id', $apartmentIds);
                    });
            })
            ->when($search, function ($query, $search) {
                $query->where('description', 'like', "%{$search}%");
            })
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($expense) {
                $group = $expense->apartmentGroup;
                $apartmentsList = $expense->apartments;
                $directApt = $expense->apartment;

                if ($group) {
                    $displayName = $group->name;
                    $isGroup = true;
                    $unitsCount = $apartmentsList->count();
                    $unitsList = $apartmentsList->pluck('name')->toArray();
                } elseif ($apartmentsList->count() > 1) {
                    $displayName = $apartmentsList->pluck('name')->join(', ');
                    $isGroup = true;
                    $unitsCount = $apartmentsList->count();
                    $unitsList = $apartmentsList->pluck('name')->toArray();
                } else {
                    $displayName = $directApt?->name ?? ($apartmentsList->first()?->name ?? 'N/A');
                    $isGroup = false;
                    $unitsCount = 1;
                    $unitsList = [$displayName];
                }

                return [
                    'id' => $expense->id,
                    'apartment_name' => $displayName,
                    'is_group' => $isGroup,
                    'group_name' => $group?->name,
                    'units_count' => $unitsCount,
                    'units_list' => $unitsList,
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
        
        $groupIds = $apartments->pluck('apartment_group_id')->filter()->unique();
        $groups = ApartmentGroup::whereIn('id', $groupIds)
            ->with(['apartments' => function ($q) use ($user) {
                $q->where('owner_id', $user->id)->select('id', 'name', 'apartment_group_id');
            }])
            ->get(['id', 'name']);

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
            'group_id' => 'nullable|exists:apartment_groups,id',
            'apartment_ids' => 'nullable|array',
            'apartment_ids.*' => 'in:' . implode(',', $userApartmentIds),
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'proof_image' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf|max:2048',
        ]);

        if (empty($validated['group_id']) && empty($validated['apartment_ids'])) {
            return back()->withErrors(['apartment_ids' => 'Please select at least one apartment or a group.']);
        }

        $path = null;
        if ($request->hasFile('proof_image')) {
            $path = $request->file('proof_image')->store('expense_proofs', 'public');
        }

        $groupId = $validated['group_id'] ?? null;
        $apartmentIds = $validated['apartment_ids'] ?? [];

        if ($groupId) {
            $groupApartmentIds = $user->apartments()
                ->where('apartment_group_id', $groupId)
                ->pluck('id')
                ->toArray();
            $finalApartmentIds = array_values(array_unique(array_merge($apartmentIds, $groupApartmentIds)));
        } else {
            $finalApartmentIds = $apartmentIds;
            $commonGroupIds = $user->apartments()
                ->whereIn('id', $finalApartmentIds)
                ->pluck('apartment_group_id')
                ->filter()
                ->unique();
            if ($commonGroupIds->count() === 1) {
                $groupId = $commonGroupIds->first();
            }
        }

        // Create a single expense row with the entire entered amount (no division)
        $expense = Expense::create([
            'user_id' => $user->id,
            'apartment_id' => count($finalApartmentIds) === 1 ? $finalApartmentIds[0] : null,
            'apartment_group_id' => $groupId,
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'date' => $validated['date'],
            'proof_image' => $path,
        ]);

        if (!empty($finalApartmentIds)) {
            $expense->apartments()->sync($finalApartmentIds);
        }

        return redirect()->route('owner.expenses.index')->with('success', 'Expense logged successfully!');
    }

    /**
     * Show the form for editing the specified expense.
     */
    public function edit(Expense $expense)
    {
        $user = auth()->user();
        $apartments = $user->apartments()->get(['id', 'name', 'apartment_group_id']);
        $userApartmentIds = $apartments->pluck('id')->toArray();

        // Security check
        $hasAccess = $expense->user_id === $user->id
            || in_array($expense->apartment_id, $userApartmentIds)
            || $expense->apartments()->whereIn('apartments.id', $userApartmentIds)->exists();

        if (!$hasAccess) {
            abort(403, 'Unauthorized action.');
        }

        $groupIds = $apartments->pluck('apartment_group_id')->filter()->unique();
        $groups = ApartmentGroup::whereIn('id', $groupIds)
            ->with(['apartments' => function ($q) use ($user) {
                $q->where('owner_id', $user->id)->select('id', 'name', 'apartment_group_id');
            }])
            ->get(['id', 'name']);

        $expenseData = $expense->toArray();
        $expenseData['proof_image_url'] = $expense->proof_image ? asset('storage/' . $expense->proof_image) : null;
        $expenseData['date'] = $expense->date ? $expense->date->format('Y-m-d') : null;
        $expenseData['selected_apartment_ids'] = $expense->apartments()->pluck('apartments.id')->toArray();
        if (empty($expenseData['selected_apartment_ids']) && $expense->apartment_id) {
            $expenseData['selected_apartment_ids'] = [$expense->apartment_id];
        }

        return Inertia::render('Owner/Expenses/Edit', [
            'apartments' => $apartments,
            'groups' => $groups,
            'expense' => $expenseData,
        ]);
    }

    /**
     * Update the specified expense in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        $user = auth()->user();
        $userApartmentIds = $user->apartments()->pluck('id')->toArray();

        // Security check
        $hasAccess = $expense->user_id === $user->id
            || in_array($expense->apartment_id, $userApartmentIds)
            || $expense->apartments()->whereIn('apartments.id', $userApartmentIds)->exists();

        if (!$hasAccess) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'group_id' => 'nullable|exists:apartment_groups,id',
            'apartment_ids' => 'nullable|array',
            'apartment_ids.*' => 'in:' . implode(',', $userApartmentIds),
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'proof_image' => 'nullable|file|mimes:jpeg,png,jpg,gif,pdf|max:2048',
        ]);

        if (empty($validated['group_id']) && empty($validated['apartment_ids'])) {
            return back()->withErrors(['apartment_ids' => 'Please select at least one apartment or a group.']);
        }

        $groupId = $validated['group_id'] ?? null;
        $apartmentIds = $validated['apartment_ids'] ?? [];

        if ($groupId) {
            $groupApartmentIds = $user->apartments()
                ->where('apartment_group_id', $groupId)
                ->pluck('id')
                ->toArray();
            $finalApartmentIds = array_values(array_unique(array_merge($apartmentIds, $groupApartmentIds)));
        } else {
            $finalApartmentIds = $apartmentIds;
            $commonGroupIds = $user->apartments()
                ->whereIn('id', $finalApartmentIds)
                ->pluck('apartment_group_id')
                ->filter()
                ->unique();
            if ($commonGroupIds->count() === 1) {
                $groupId = $commonGroupIds->first();
            }
        }

        $updateData = [
            'apartment_id' => count($finalApartmentIds) === 1 ? $finalApartmentIds[0] : null,
            'apartment_group_id' => $groupId,
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'date' => $validated['date'],
        ];

        if ($request->hasFile('proof_image')) {
            $path = $request->file('proof_image')->store('expense_proofs', 'public');
            $updateData['proof_image'] = $path;
        }

        $expense->update($updateData);
        $expense->apartments()->sync($finalApartmentIds);

        return redirect()->route('owner.expenses.index')->with('success', 'Expense updated successfully!');
    }

    /**
     * Remove the specified expense from storage.
     */
    public function destroy(Expense $expense)
    {
        $user = auth()->user();
        $userApartmentIds = $user->apartments()->pluck('id')->toArray();

        // Security check
        $hasAccess = $expense->user_id === $user->id
            || in_array($expense->apartment_id, $userApartmentIds)
            || $expense->apartments()->whereIn('apartments.id', $userApartmentIds)->exists();

        if (!$hasAccess) {
            abort(403, 'Unauthorized action.');
        }

        $expense->delete();

        return redirect()->route('owner.expenses.index')->with('success', 'Expense deleted successfully!');
    }
}
