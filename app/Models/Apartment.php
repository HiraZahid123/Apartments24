<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Apartment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'city',
        'instructions',
        'instructions_et',
        'instructions_ru',
        'rental_terms',
        'rental_terms_et',
        'rental_terms_ru',
        'arrival_url',
        'arrival_url_en',
        'arrival_url_et',
        'arrival_url_ru',
        'owner_id',
        'owner_name',
        'keybox_code',
        'smart_lock_code',
        'wifi_ssid',
        'wifi_password',
        'is_active',
        'bed_type',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the owner that owns the apartment.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the bookings for the apartment.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get the guidebook for the apartment.
     */
    public function guidebook(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Guidebook::class);
    }

    /**
     * Get the expenses for the apartment.
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }
}
