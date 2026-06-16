<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Guidebook extends Model
{
    use HasFactory;

    protected $fillable = [
        'apartment_id',
        'welcome_title',
        'welcome_message',
        'banner_image',
        'sections',
    ];

    protected $casts = [
        'welcome_title' => 'array',
        'welcome_message' => 'array',
        'sections' => 'array',
    ];

    /**
     * Get the apartment that owns the guidebook.
     */
    public function apartment(): BelongsTo
    {
        return $this->belongsTo(Apartment::class);
    }
}
