<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - Apartments24</title>
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
                $linkedContent = preg_replace(
                    '~(https?://[^\s\(\)]+[^\s\(\)\. \! \? \,])~',
                    '<a href="$1" style="color: #FF5B22; text-decoration: underline;">$1</a>',
                    $safeContent
                );
            @endphp
            {!! nl2br($linkedContent) !!}
        </div>
        <div class="button-container">
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
