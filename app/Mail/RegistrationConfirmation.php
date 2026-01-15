<?php

namespace App\Mail;

use App\Models\Registration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RegistrationConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $registration;
    public $event;

    public function __construct(Registration $registration)
    {
        $this->registration = $registration;
        $this->event = $registration->event->load('formFields'); // eager load form fields
    }

    public function build()
    {
        return $this->subject('Confirm Your Registration')
                    ->view('emails.registration_confirmation')
                    ->with([
                        'registration' => $this->registration,
                        'event' => $this->event,
                    ]);
    }
}
