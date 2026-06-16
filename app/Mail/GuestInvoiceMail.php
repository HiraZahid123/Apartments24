<?php

namespace App\Mail;

use App\Models\Booking;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GuestInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $language;

    /**
     * Create a new message instance.
     */
    public function __construct(Booking $booking, $language = 'en')
    {
        $this->booking = $booking;
        $this->language = $language;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subjects = [
            'en' => 'Your Invoice from Apartments24',
            'et' => 'Teie arve ettevõttelt Apartments24',
            'ru' => 'Ваш счет от Apartments24',
        ];

        return new Envelope(
            subject: $subjects[$this->language] ?? $subjects['en'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.guest_invoice',
            with: [
                'booking' => $this->booking,
                'language' => $this->language,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $this->booking->load(['apartment', 'checkin']);

        $settings = Setting::whereIn('key', [
            'company_name',
            'company_address',
            'company_registration_code',
            'company_vat_number',
            'bank_account_details'
        ])->pluck('value', 'key')->toArray();

        $pdf = Pdf::loadView('pdf.invoice', [
            'booking' => $this->booking,
            'settings' => $settings,
            'language' => $this->language,
        ]);

        return [
            Attachment::fromData(fn () => $pdf->output(), 'invoice-' . str_pad($this->booking->id, 5, '0', STR_PAD_LEFT) . '.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
