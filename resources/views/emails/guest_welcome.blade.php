@component('mail::message')
# Welcome to {{ $booking->apartment->name }}!

We are excited to have you check in. Here are your access details:

## Access Codes
**Keybox Code:** {{ $booking->apartment->keybox_code ?? '----' }}

## WiFi Details
**Network:** Apartments24_Guest
**Password:** Welcome24

## Arrival Instructions
{{ $booking->apartment->instructions ?? 'No special instructions provided.' }}

@if($booking->apartment->arrival_url)
@component('mail::button', ['url' => $booking->apartment->arrival_url])
View Location Map
@endcomponent
@endif

@component('mail::button', ['url' => route('guest.checkin.success', ['token' => $booking->checkin_token])])
View Check-in Dashboard / Checkout
@endcomponent

Enjoy your stay!

Thanks,<br>
{{ config('app.name') }}
@endcomponent
