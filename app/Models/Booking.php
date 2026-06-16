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
        'service_fee',
        'net_revenue',
        'status',
        'checkin_token',
        'checkin_form_sent',
        'checkin_form_sent_at',
        'is_checked_in',
        'checked_in_at',
        'is_checked_out',
        'checked_out_at',
        'wants_invoice',
        'invoice_name',
        'invoice_registration_code',
        'invoice_address',
        'invoice_vat_number',
        'invoice_accommodated_guests',
    ];

    protected $appends = ['linked_apartment_names'];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'total_price' => 'decimal:2',
        'service_fee' => 'decimal:2',
        'net_revenue' => 'decimal:2',
        'checkin_form_sent' => 'boolean',
        'checkin_form_sent_at' => 'datetime',
        'is_checked_in' => 'boolean',
        'checked_in_at' => 'datetime',
        'is_checked_out' => 'boolean',
        'checked_out_at' => 'datetime',
        'wants_invoice' => 'boolean',
    ];

    /**
     * Get the apartment that the booking belongs to.
     */
    public function apartment(): BelongsTo
    {
        return $this->belongsTo(Apartment::class);
    }

    /**
     * Get all apartments that were booked together with this one.
     * Logic: same guest email, same dates, created within the same minute.
     */
    public function getLinkedApartments()
    {
        return Booking::where('guest_email', $this->guest_email)
            ->where('check_in_date', $this->check_in_date)
            ->where('check_out_date', $this->check_out_date)
            ->whereBetween('created_at', [
                $this->created_at->copy()->subMinutes(1),
                $this->created_at->copy()->addMinutes(1)
            ])
            ->with('apartment')
            ->get()
            ->pluck('apartment')
            ->filter()
            ->unique('id');
    }

    /**
     * Get the names of all linked apartments as a comma-separated string.
     */
    public function getLinkedApartmentNamesAttribute()
    {
        $apartments = $this->getLinkedApartments();
        if ($apartments->isEmpty()) {
            return $this->apartment->name ?? 'N/A';
        }
        return $apartments->pluck('name')->implode(', ');
    }

    /**
     * Get the check-in data associated with the booking.
     */
    public function checkins(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(GuestCheckin::class);
    }

    /**
     * Backward compatibility or shortcut for the first check-in (main guest).
     */
    public function checkin(): HasOne
    {
        return $this->hasOne(GuestCheckin::class)->oldest();
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
                // New formula:
                // 1. Price after VAT (13%)
                $priceAfterVat = $booking->total_price / 1.13;
                
                // 2. Net Income (Price after VAT - Service Fee)
                $serviceFee = $booking->service_fee ?? 0;
                $netIncome = $priceAfterVat - $serviceFee;
                
                // 3. Owner Revenue (Net Income * Owner's Custom Percentage)
                $ownerPercentage = 0.65; // Default
                $apartment = $booking->apartment ?? \App\Models\Apartment::find($booking->apartment_id);
                if ($apartment && $apartment->owner) {
                    $ownerPercentage = $apartment->owner->owner_revenue_percentage / 100;
                }
                
                $booking->net_revenue = $netIncome * $ownerPercentage;
            }
        });
    }
}
