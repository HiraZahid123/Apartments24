@php
    $translations = [
        'en' => [
            'subject' => 'Your Invoice from Apartments24',
            'greeting' => 'Hello',
            'thank_you' => 'Thank you for staying with us. Please find your invoice attached to this email.',
            'details' => 'Booking Details:',
            'apartment' => 'Apartment',
            'dates' => 'Dates',
            'regards' => 'Best regards,',
            'team' => 'Apartments24 Team'
        ],
        'et' => [
            'subject' => 'Teie arve ettevõttelt Apartments24',
            'greeting' => 'Tere',
            'thank_you' => 'Täname teid, et peatusite meie juures. Teie arve on lisatud sellele e-kirjale.',
            'details' => 'Broneeringu andmed:',
            'apartment' => 'Korter',
            'dates' => 'Kuupäevad',
            'regards' => 'Parimate soovidega,',
            'team' => 'Apartments24 meeskond'
        ],
        'ru' => [
            'subject' => 'Ваш счет от Apartments24',
            'greeting' => 'Здравствуйте',
            'thank_you' => 'Благодарим вас за пребывание у нас. Ваш счет прикреплен к этому письму.',
            'details' => 'Детали бронирования:',
            'apartment' => 'Апартаменты',
            'dates' => 'Даты',
            'regards' => 'С наилучшими пожеланиями,',
            'team' => 'Команда Apartments24'
        ]
    ];
    $lang = $language ?? 'en';
    $t = $translations[$lang] ?? $translations['en'];
@endphp

<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .container { padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; }
        .footer { margin-top: 30px; font-size: 0.9em; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <h2>{{ $t['greeting'] }} {{ $booking->guest_name }},</h2>
        <p>{{ $t['thank_you'] }}</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>{{ $t['details'] }}</strong><br>
            {{ $t['apartment'] }}: {{ $booking->linked_apartment_names }}<br>
            {{ $t['dates'] }}: {{ $booking->check_in_date->format('d.m.Y') }} - {{ $booking->check_out_date->format('d.m.Y') }}
        </div>

        <p>
            {{ $t['regards'] }}<br>
            <strong>{{ $t['team'] }}</strong>
        </p>
    </div>
</body>
</html>
