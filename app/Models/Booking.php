<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'apartment_id',
        'guest_name',
        'guest_email',
        'check_in_date',
        'check_out_date',
        'number_of_guests',
        'preferred_language',
        'total_price',
        'net_revenue',
        'status',
        'checkin_token',
        'checkin_form_sent',
        'checkin_form_sent_at',
        'is_checked_in',
        'checked_in_at',
        'is_checked_out',
        'checked_out_at',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'total_price' => 'decimal:2',
        'net_revenue' => 'decimal:2',
        'checkin_form_sent' => 'boolean',
        'checkin_form_sent_at' => 'datetime',
        'is_checked_in' => 'boolean',
        'checked_in_at' => 'datetime',
        'is_checked_out' => 'boolean',
        'checked_out_at' => 'datetime',
    ];

    /**
     * Get the apartment that the booking belongs to.
     */
    public function apartment(): BelongsTo
    {
        return $this->belongsTo(Apartment::class);
    }

    /**
     * Get the check-in data associated with the booking.
     */
    public function checkin(): HasOne
    {
        return $this->hasOne(GuestCheckin::class);
    }

    /**
     * Automatically calculate net revenue on save (65% for owner).
     * Also generate unique token on creation.
     */
    protected static function booted()
    {
        static::creating(function ($booking) {
            if (empty($booking->checkin_token)) {
                $booking->checkin_token = \Illuminate\Support\Str::random(64);
            }
        });

        static::saving(function ($booking) {
            if ($booking->total_price) {
                // Default logic: net revenue is 65% of total price
                // In a more complex setup, you'd subtract VAT and service fees first
                $booking->net_revenue = $booking->total_price * 0.65;
            }
        });
    }
}
