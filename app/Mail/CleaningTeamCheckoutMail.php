<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CleaningTeamCheckoutMail extends Mailable
{
    use SerializesModels;

    public $booking;
    public $apartmentName;
    public $guestName;

    public function __construct($booking)
    {
        $this->booking = $booking;
        $this->apartmentName = $booking->linked_apartment_names;
        $this->guestName = $booking->guest_name;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Guest Departure Alert: {$this->apartmentName} - {$this->guestName}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.cleaning_team_checkout',
            with: [
                'apartmentName' => $this->apartmentName,
                'guestName' => $this->guestName,
            ]
        );
    }
}
