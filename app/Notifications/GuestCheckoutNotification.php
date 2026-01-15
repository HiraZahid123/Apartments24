<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GuestCheckoutNotification extends Notification
{
    use Queueable;

    private $booking;

    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Guest Checked Out - ' . $this->booking->apartment->name)
            ->line($this->booking->guest_name . ' has checked out from ' . $this->booking->apartment->name)
            ->action('View Booking', route('admin.bookings.edit', $this->booking->id))
            ->line('Thank you for using our application!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Guest Checked Out',
            'message' => "{$this->booking->guest_name} has checked out from {$this->booking->apartment->name}",
            'booking_id' => $this->booking->id,
            'type' => 'checkout',
            'icon_color' => 'text-amber-500',
            'bg_color' => 'bg-amber-50',
            'action_url' => route('admin.bookings.edit', $this->booking->id),
        ];
    }
}
