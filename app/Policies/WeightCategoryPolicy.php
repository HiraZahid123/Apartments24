<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WeightCategory;

class WeightCategoryPolicy
{
    /**
     * Determine whether the user can update the weight category.
     */
    public function update(User $user, WeightCategory $weightCategory): bool
    {
        // Example: allow only admins (you can adjust)
        return $user->is_admin === 1;
    }

    /**
     * Determine whether the user can delete the weight category.
     */
    public function delete(User $user, WeightCategory $weightCategory): bool
    {
        // Example: allow only admins
        return $user->is_admin === 1;
    }

    /**
     * Determine whether the user can view the weight category.
     */
    public function view(User $user, WeightCategory $weightCategory): bool
    {
        return true; // anyone logged in can view
    }

    /**
     * Determine whether the user can create a weight category.
     */
    public function create(User $user): bool
    {
        return $user->is_admin === 1;
    }
}
