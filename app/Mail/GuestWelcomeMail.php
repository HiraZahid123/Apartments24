<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\MessageTemplate;

class GuestWelcomeMail extends Mailable
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
        $template = MessageTemplate::getTemplate('welcome', $language);
        
        if ($template) {
            $apartment = $booking->apartment;
            
            // Prepare arrival URL in correct language
            $arrivalUrl = $apartment->arrival_url_en ?? $apartment->arrival_url;
            if ($language === 'et' && $apartment->arrival_url_et) {
                $arrivalUrl = $apartment->arrival_url_et;
            } elseif ($language === 'ru' && $apartment->arrival_url_ru) {
                $arrivalUrl = $apartment->arrival_url_ru;
            }

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

            // Get instructions in correct language
            $instructions = $apartment->instructions; // Default
            if ($language === 'et' && $apartment->instructions_et) {
                $instructions = $apartment->instructions_et;
            } elseif ($language === 'ru' && $apartment->instructions_ru) {
                $instructions = $apartment->instructions_ru;
            }

            // Prepare smart lock block
            $smartLockBlock = "";
            if ($apartment->smart_lock_code) {
                $label = 'Smart Lock Code';
                if ($language === 'et') $label = 'Nutiluku kood';
                if ($language === 'ru') $label = 'Код умного замка';
                $smartLockBlock = "{$label}: {$apartment->smart_lock_code}";
            }

            $this->templateData = $template->replaceVariables([
                'guest_name' => $booking->guest_name,
                'apartment_name' => $apartment->name,
                'keybox_code' => $apartment->keybox_code ?? '----',
                'smart_lock_block' => $smartLockBlock,
                'wifi_ssid' => $apartment->wifi_ssid ?? 'Apartments24_Guest',
                'wifi_password' => $apartment->wifi_password ?? 'Welcome24',
                'arrival_instructions' => $instructions ?? 'No special instructions provided.',
                'map_label' => $labels['map'],
                'dashboard_label' => $labels['dashboard'],
                'arrival_url' => $arrivalUrl,
            ]);
            $this->templateData['labels'] = $labels; // Store all labels for convenience
        } else {
            $this->templateData = [
                'subject' => 'Welcome to ' . $booking->linked_apartment_names . ' - Access Details',
                'content' => "Welcome to {$booking->apartment->name}!"
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
            view: 'emails.guest_welcome',
            with: [
                'content' => $this->templateData['content'],
                'booking' => $this->booking,
                'templateData' => $this->templateData,
            ]
        );
    }
}
