<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'apartment_id',
        'apartment_group_id',
        'user_id',
        'description',
        'amount',
        'date',
        'proof_image',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the apartment the expense directly belongs to (for single-apartment expenses).
     */
    public function apartment(): BelongsTo
    {
        return $this->belongsTo(Apartment::class);
    }

    /**
     * Get the apartment group the expense belongs to (for group expenses).
     */
    public function apartmentGroup(): BelongsTo
    {
        return $this->belongsTo(ApartmentGroup::class);
    }

    /**
     * Get the owner that logged the expense.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all apartments associated with this expense.
     */
    public function apartments(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Apartment::class, 'apartment_expense')->withTimestamps();
    }
}
