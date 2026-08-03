<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\MessageTemplate;

class CheckinLinkMail extends Mailable
{
    use SerializesModels;

    public $booking;
    public $language;
    public $templateData;

    /**
     * Create a new message instance.
     */
    public function __construct($booking, $language = 'en')
    {
        $this->booking = $booking;
        $this->language = $language;
        
        // Get template from database
        $template = MessageTemplate::getTemplate('guest_registration', $language);
        
        // Prepare button labels
        $labels = [
            'map' => 'View Location Map',
            'dashboard' => 'View Check-in Dashboard / Checkout',
            'checkout' => 'Easy Checkout'
        ];

        if ($language === 'et') {
            $labels['map'] = 'Vaata asukohta kaardil';
            $labels['dashboard'] = 'Sisseregistreerimise töölaud / Väljaregistreerimine';
            $labels['checkout'] = 'Lihtne väljaregistreerimine';
        } elseif ($language === 'ru') {
            $labels['map'] = 'Посмотреть на карте';
            $labels['dashboard'] = 'Панель регистрации / Выезд';
            $labels['checkout'] = 'Простая регистрация выезда';
        }

        if ($template) {
            $checkinLink = url('/guest/checkin/' . $booking->checkin_token);
            $checkinDate = \Carbon\Carbon::parse($booking->check_in_date)->format('d M Y');
            
            $this->templateData = $template->replaceVariables([
                'guest_name' => $booking->guest_name,
                'apartment_name' => $booking->apartment->name,
                'checkin_date' => $checkinDate,
                'checkin_link' => $checkinLink,
                'dashboard_label' => $labels['dashboard'],
            ]);
            $this->templateData['labels'] = $labels;
        } else {
            // Fallback to default English
            $this->templateData = [
                'subject' => 'Guest Registration - Apartments24 [' . $booking->apartment->name . ']',
                'content' => "Hello {$booking->guest_name}!\n\nThank you for choosing Apartments24.",
                'labels' => $labels,
            ];
        }
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->templateData['subject'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.checkin-link',
            with: [
                'content' => $this->templateData['content'],
                'booking' => $this->booking,
                'templateData' => $this->templateData,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
