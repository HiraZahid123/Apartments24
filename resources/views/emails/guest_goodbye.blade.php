@component('mail::message')
# Thank you for staying with us!

We hope you had a pleasant stay at {{ $booking->apartment->name }}.

Safe travels!

Thanks,<br>
{{ config('app.name') }}
@endcomponent
