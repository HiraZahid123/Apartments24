@php
    $lang = $language ?? 'en';
    $translations = [
        'en' => [
            'invoice' => 'INVOICE',
            'invoice_number' => 'Invoice Number',
            'issue_date' => 'Issue Date',
            'billed_to' => 'Billed To',
            'reservation_details' => 'Reservation Details',
            'apartment' => 'Apartment',
            'check_in' => 'Check-in',
            'check_out' => 'Check-out',
            'guests' => 'Guests',
            'accommodated_guests' => 'Accommodated Guests',
            'description' => 'Description',
            'total' => 'Total',
            'accommodation_service' => 'Accommodation Service',
            'nights' => 'nights',
            'total_due' => 'Total Due',
            'payment_info' => 'Payment Information',
            'thank_you' => 'Thank you for your business!',
            'generated_by' => 'Generated automatically by Apartments24 System.',
            'reg_code' => 'Reg Code',
            'vat' => 'VAT',
            'of_which_vat' => 'of which VAT',
        ],
        'et' => [
            'invoice' => 'ARVE',
            'invoice_number' => 'Arve number',
            'issue_date' => 'Kuupäev',
            'billed_to' => 'Maksja',
            'reservation_details' => 'Broneeringu andmed',
            'apartment' => 'Korter',
            'check_in' => 'Sisseregistreerimine',
            'check_out' => 'Väljaregistreerimine',
            'guests' => 'Külalised',
            'accommodated_guests' => 'Majutatud külalised',
            'description' => 'Kirjeldus',
            'total' => 'Summa',
            'accommodation_service' => 'Majutusteenus',
            'nights' => 'ööd',
            'total_due' => 'Kokku tasuda',
            'payment_info' => 'Makseinfo',
            'thank_you' => 'Täname teid!',
            'generated_by' => 'Genereeritud automaatselt Apartments24 süsteemi poolt.',
            'reg_code' => 'Reg. kood',
            'vat' => 'KMKR',
            'of_which_vat' => 'millest käibemaks',
        ],
        'ru' => [
            'invoice' => 'СЧЕТ',
            'invoice_number' => 'Номер счета',
            'issue_date' => 'Дата выставления',
            'billed_to' => 'Плательщик',
            'reservation_details' => 'Детали бронирования',
            'apartment' => 'Апартаменты',
            'check_in' => 'Заезд',
            'check_out' => 'Выезд',
            'guests' => 'Гости',
            'accommodated_guests' => 'Проживающие гости',
            'description' => 'Описание',
            'total' => 'Итого',
            'accommodation_service' => 'Услуги проживания',
            'nights' => 'ночи',
            'total_due' => 'Итого к оплате',
            'payment_info' => 'Информация об оплате',
            'thank_you' => 'Благодарим за сотрудничество!',
            'generated_by' => 'Сгенерировано автоматически системой Apartments24.',
            'reg_code' => 'Рег. код',
            'vat' => 'НДС',
            'of_which_vat' => 'в том числе НДС',
        ],
    ];
    $t = $translations[$lang] ?? $translations['en'];
@endphp
<!DOCTYPE html>
<html lang="{{ $lang }}">
<head>
    <meta charset="UTF-8">
    <title>{{ $t['invoice'] }} #{{ str_pad($booking->id, 5, '0', STR_PAD_LEFT) }}</title>
    <style>
        body {
            /* Use a safer font stack for DomPDF */
            font-family: 'DejaVu Sans', sans-serif;
            color: #333;
            line-height: 1.5;
            font-size: 14px;
        }
        .container {
            width: 100%;
            margin: auto;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            padding: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .header td {
            vertical-align: top;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #d97706; /* Brand orange color */
            margin-top: 0;
        }
        .text-right {
            text-align: right;
        }
        .details-box {
            margin-top: 30px;
        }
        .details-box td {
            vertical-align: top;
            width: 50%;
        }
        .heading {
            font-weight: bold;
            background: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
            padding: 8px;
        }
        .info-panel {
            padding: 8px;
            border: 1px solid #e2e8f0;
            border-top: none;
            min-height: 100px;
        }
        .items-table {
            margin-top: 30px;
        }
        .items-table th {
            background: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
            text-align: left;
            padding: 10px;
        }
        .items-table td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        .total-row td {
            font-weight: bold;
            border-top: 2px solid #e2e8f0;
        }
        .footer {
            margin-top: 50px;
            font-size: 12px;
            color: #64748b;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <table class="header">
            <tr>
                <td>
                    <h1 class="title">{{ $t['invoice'] }}</h1>
                    <p>
                        {{ $t['invoice_number'] }}: #{{ str_pad($booking->id, 5, '0', STR_PAD_LEFT) }}<br>
                        {{ $t['issue_date'] }}: {{ now()->format('d.m.Y') }}<br>
                    </p>
                </td>
                <td class="text-right">
                    <strong>{{ $settings['company_name'] ?? 'Your Company Name' }}</strong><br>
                    @if(!empty($settings['company_registration_code']))
                        {{ $t['reg_code'] }}: {{ $settings['company_registration_code'] }}<br>
                    @endif
                    @if(!empty($settings['company_vat_number']))
                        {{ $t['vat'] }}: {{ $settings['company_vat_number'] }}<br>
                    @endif
                    @if(!empty($settings['company_address']))
                        {!! nl2br(e($settings['company_address'])) !!}
                    @endif
                </td>
            </tr>
        </table>

        <!-- Details -->
        <table class="details-box" cellpadding="0" cellspacing="10">
            <tr>
                <td>
                    <div class="heading">{{ $t['billed_to'] }}</div>
                    <div class="info-panel">
                        <strong>{{ $booking->wants_invoice && $booking->invoice_name ? $booking->invoice_name : $booking->guest_name }}</strong><br>
                        
                        @if($booking->wants_invoice)
                            @if($booking->invoice_registration_code)
                                {{ $t['reg_code'] }}: {{ $booking->invoice_registration_code }}<br>
                            @endif
                            @if($booking->invoice_vat_number)
                                {{ $t['vat'] }}: {{ $booking->invoice_vat_number }}<br>
                            @endif
                            @if($booking->invoice_address)
                                {!! nl2br(e($booking->invoice_address)) !!}<br>
                            @endif
                        @else
                            {{ $booking->guest_email }}<br>
                        @endif
                    </div>
                </td>
                <td>
                    <div class="heading">{{ $t['reservation_details'] }}</div>
                    <div class="info-panel">
                        <strong>{{ $t['apartment'] }}:</strong> {{ $booking->linked_apartment_names }}<br>
                        <strong>{{ $t['check_in'] }}:</strong> {{ $booking->check_in_date->format('d.m.Y') }}<br>
                        <strong>{{ $t['check_out'] }}:</strong> {{ $booking->check_out_date->format('d.m.Y') }}<br>
                        <strong>{{ $t['guests'] }}:</strong> {{ $booking->number_of_guests }}<br>
                        @if($booking->wants_invoice && $booking->invoice_accommodated_guests)
                            <br><strong>{{ $t['accommodated_guests'] }}:</strong><br>
                            {!! nl2br(e($booking->invoice_accommodated_guests)) !!}
                        @endif
                    </div>
                </td>
            </tr>
        </table>

        <!-- Items -->
        <table class="items-table">
            <thead>
                <tr>
                    <th>{{ $t['description'] }}</th>
                    <th class="text-right">{{ $t['total'] }}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $t['accommodation_service'] }} ({{ $booking->check_in_date->diffInDays($booking->check_out_date) }} {{ $t['nights'] }})</td>
                    <td class="text-right">€ {{ number_format($booking->total_price, 2) }}</td>
                </tr>
                <tr>
                    <td class="text-right" style="color: #64748b; font-size: 12px; border-top: none;">{{ $t['of_which_vat'] }} (13%):</td>
                    <td class="text-right" style="color: #64748b; font-size: 12px; border-top: none;">€ {{ number_format($booking->total_price - ($booking->total_price / 1.13), 2) }}</td>
                </tr>
                {{-- Service / Extra Fees hidden as per user request --}}
                <tr class="total-row">
                    <td class="text-right">{{ $t['total_due'] }}:</td>
                    <td class="text-right">€ {{ number_format($booking->total_price, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Footer / Bank Details -->
        @if(!empty($settings['bank_account_details']))
        <div style="margin-top: 40px;">
            <strong>{{ $t['payment_info'] }}:</strong><br>
            {!! nl2br(e($settings['bank_account_details'])) !!}
        </div>
        @endif

        <div class="footer">
            {{ $t['thank_you'] }}<br>
            {{ $t['generated_by'] }}
        </div>
    </div>
</body>
</html>

