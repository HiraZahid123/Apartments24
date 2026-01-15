<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guest Registration - Apartments24</title>
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
        .welcome {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 16px;
            color: #0f172a;
        }
        .apartment-card {
            background-color: #fff7ed;
            border: 1px solid #ffedd5;
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
        }
        .apartment-name {
            font-weight: 800;
            font-size: 18px;
            color: #c2410c;
            display: block;
            margin-bottom: 4px;
        }
        .apartment-details {
            font-size: 14px;
            color: #9a3412;
            font-weight: 600;
        }
        .cta-container {
            text-align: center;
            margin: 32px 0;
        }
        .btn {
            background-color: #FF5B22;
            color: #ffffff !important;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 800;
            font-size: 16px;
            display: inline-block;
            transition: all 0.2s;
            box-shadow: 0 4px 6px -1px rgba(255, 91, 34, 0.3);
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
            <h2 class="welcome">Tere, {{ $booking->guest_name }}!</h2>
            <p>Thank you for choosing Apartments24. We are looking forward to your stay.</p>
            
            <p>To ensure a smooth arrival, please complete your digital registration before your check-in. This will give you access to your entry codes and arrival instructions.</p>

            <div class="apartment-card">
                <span class="apartment-name">{{ $booking->apartment->name }}</span>
                <span class="apartment-details">
                    Check-in: {{ \Carbon\Carbon::parse($booking->check_in)->format('d M Y') }}
                </span>
            </div>

            <div class="cta-container">
                <a href="{{ url('/guest/checkin/' . $booking->checkin_token) }}" class="btn">
                    Start Digital Check-in
                </a>
            </div>

            <p style="font-size: 14px; color: #64748b;">
                If you have any questions, feel free to reply to this email or contact us via WhatsApp.
            </p>
        </div>
        <div class="footer">
            <p><strong>Apartments24 Guest Host System</strong></p>
            <p>© {{ date('Y') }} Apartments24. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
