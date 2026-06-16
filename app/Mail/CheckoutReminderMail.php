<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\MessageTemplate;

class CheckoutReminderMail extends Mailable
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
        $template = MessageTemplate::getTemplate('checkout_reminder', $language);
        
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
            $checkoutDate = \Carbon\Carbon::parse($booking->check_out_date)->format('d.m.Y');
            
            $this->templateData = $template->replaceVariables([
                'guest_name' => $booking->guest_name,
                'apartment_name' => $this->booking->linked_apartment_names,
                'checkout_date' => $checkoutDate,
                'checkout_label' => $labels['checkout'],
            ]);
            $this->templateData['labels'] = $labels;
        } else {
            $checkoutDate = \Carbon\Carbon::parse($booking->check_out_date)->format('d.m.Y');
            $this->templateData = [
                'subject' => 'Check-out Reminder & Easy Checkout Link',
                'content' => "Hello {$booking->guest_name}!\n\nJust a quick reminder that your check-out is on {$checkoutDate} at 11:00 or earlier.",
                'checkout_label' => $labels['checkout'],
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
            view: 'emails.checkout_reminder',
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
