<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewBookingNotification extends Notification
{
    use Queueable;

    private $booking;

    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'New Booking Received',
            'message' => "{$this->booking->guest_name} has booked {$this->booking->apartment->name}",
            'booking_id' => $this->booking->id,
            'type' => 'booking',
            'icon_color' => 'text-blue-500',
            'bg_color' => 'bg-blue-50',
            'action_url' => route('admin.bookings.edit', $this->booking->id),
        ];
    }
}
