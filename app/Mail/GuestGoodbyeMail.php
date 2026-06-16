<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\MessageTemplate;

class GuestGoodbyeMail extends Mailable
{
    use SerializesModels;

    public $booking;
    public $language;
    public $templateData;

    public function __construct($booking, $language = 'en')
    {
        $this->booking = $booking;
        $this->language = $language;
        
        // Get template from database
        $template = MessageTemplate::getTemplate('thank_you', $language);
        
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
            $this->templateData = $template->replaceVariables([
                'guest_name' => $booking->guest_name,
                'apartment_name' => $booking->linked_apartment_names,
            ]);
            $this->templateData['labels'] = $labels;
        } else {
            $this->templateData = [
                'subject' => 'Thank you for staying with us!',
                'content' => "Thank you for staying with us at {$booking->linked_apartment_names}!",
                'labels' => $labels,
            ];
        }
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->templateData['subject'],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.guest_goodbye',
            with: [
                'content' => $this->templateData['content'],
                'booking' => $this->booking,
                'templateData' => $this->templateData,
            ]
        );
    }
}
