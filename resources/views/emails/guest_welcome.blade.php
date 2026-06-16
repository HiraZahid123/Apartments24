<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{ $booking->apartment->name }} - Apartments24</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            color: #1e293b;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #FF5B22;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.025em;
        }
        .content {
            padding: 40px;
        }
        .button-container {
            padding: 0 40px 40px;
            text-align: center;
        }
        .button {
            display: inline-block;
            background-color: #FF5B22;
            color: #ffffff;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            margin-bottom: 20px;
            width: 80%;
        }
        .footer {
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            background-color: #f1f5f9;
        }
        .footer p {
            margin: 4px 0;
        }
        h2, h3 {
            color: #0f172a;
            margin-top: 24px;
        }
        strong {
            color: #0f172a;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Apartments24</h1>
        </div>
        <div class="content">
            @php
                $safeContent = e($content);
                // Bold markdown-style bold text **text**
                $safeContent = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', $safeContent);
                // Make URLs clickable
                $linkedContent = preg_replace(
                    '~(https?://[^\s\(\)]+[^\s\(\)\. \! \? \,])~',
                    '<a href="$1" style="color: #FF5B22; text-decoration: underline;">$1</a>',
                    $safeContent
                );
            @endphp
            {!! nl2br($linkedContent) !!}
        </div>
        <div class="button-container">
            @if(isset($templateData['arrival_url']))
                <a href="{{ $templateData['arrival_url'] }}" class="button">{{ $templateData['labels']['map'] ?? 'View Location Map' }}</a>
            @endif
            
            <a href="{{ route('guest.checkin.success', ['token' => $booking->checkin_token]) }}" class="button" style="background-color: #1e293b;">
                {{ $templateData['labels']['dashboard'] ?? 'View Check-in Dashboard / Checkout' }}
            </a>
        </div>
        <div class="footer">
            <p><strong>Apartments24 Guest Host System</strong></p>
            <p>© {{ date('Y') }} Apartments24. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
