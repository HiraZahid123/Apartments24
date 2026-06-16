<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type', // admin, owner, guest
        'phone',
        'preferred_language',
        'is_active',
        'owner_revenue_percentage'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'owner_revenue_percentage' => 'decimal:2',
    ];

    // User type helpers
    public function isAdmin(): bool
    {
        return $this->user_type === 'admin';
    }

    public function isOwner(): bool
    {
        return $this->user_type === 'owner';
    }

    public function isGuest(): bool
    {
        return $this->user_type === 'guest';
    }

    // Relationships
    public function apartments(): HasMany
    {
        return $this->hasMany(Apartment::class, 'owner_id');
    }

    public function verified_checkins(): HasMany
    {
        return $this->hasMany(GuestCheckin::class, 'verified_by');
    }
}
