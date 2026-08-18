<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guest Departure Alert - Apartments24</title>
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
        .detail-row {
            padding: 16px 20px;
            background-color: #f1f5f9;
            border-radius: 12px;
            margin-bottom: 12px;
        }
        .detail-label {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
        }
        .detail-value {
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
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
            <h1>Guest Departure Alert</h1>
        </div>
        <div class="content">
            <div class="detail-row">
                <div class="detail-label">Apartment</div>
                <div class="detail-value">{{ $apartmentName }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Guest</div>
                <div class="detail-value">{{ $guestName }}</div>
            </div>
            <p>The guest has officially departed. The apartment is now empty and clear for standard turnaround cleaning.</p>
        </div>
        <div class="footer">
            <p><strong>Apartments24 Guest Host System</strong></p>
            <p>© {{ date('Y') }} Apartments24. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
