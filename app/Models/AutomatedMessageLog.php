<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AutomatedMessageLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'message_type',
        'language',
        'status',
        'recipient_email',
        'error_message',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    /**
     * Get the booking associated with this log.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Log a sent message.
     */
    public static function logMessage(
        int $bookingId,
        string $messageType,
        string $language,
        string $recipientEmail,
        bool $success = true,
        ?string $errorMessage = null
    ): void {
        self::create([
            'booking_id' => $bookingId,
            'message_type' => $messageType,
            'language' => $language,
            'recipient_email' => $recipientEmail,
            'status' => $success ? 'sent' : 'failed',
            'error_message' => $errorMessage,
            'sent_at' => now(),
        ]);
    }
}
