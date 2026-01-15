<?php

namespace App\Policies;

use App\Models\User;
use App\Models\AgeCategory;

class AgeCategoryPolicy
{
    /**
     * Can the user view this category?
     */
    public function view(User $user, AgeCategory $ageCategory): bool
    {
        return true; // everyone logged in can view
    }

    /**
     * Can the user create categories?
     */
    public function create(User $user): bool
    {
        return $user->is_admin === 1; // only admins
    }

    /**
     * Can the user update this category?
     */
    public function update(User $user, AgeCategory $ageCategory): bool
    {
        return $user->is_admin === 1; // only admins
    }

    /**
     * Can the user delete this category?
     */
    public function delete(User $user, AgeCategory $ageCategory): bool
    {
        return $user->is_admin === 1; // only admins
    }
}
