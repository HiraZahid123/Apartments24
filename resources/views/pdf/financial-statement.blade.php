<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Financial Statement - {{ $month }} {{ $year }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #334155;
            line-height: 1.5;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 20px;
        }
        .logo {
            height: 60px;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            color: #0f172a;
            margin: 0;
        }
        .subtitle {
            font-size: 14px;
            color: #64748b;
            margin-top: 5px;
        }
        .summary-grid {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .summary-card {
            display: table-cell;
            width: 25%;
            padding: 15px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            text-align: center;
        }
        .card-title {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #64748b;
            margin-bottom: 5px;
        }
        .card-value {
            font-size: 18px;
            font-weight: bold;
            color: #0f172a;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            color: #0f172a;
            margin-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 30px;
        }
        th {
            text-align: left;
            background-color: #f1f5f9;
            color: #475569;
            padding: 10px;
            text-transform: uppercase;
            font-size: 10px;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #f1f5f9;
        }
        .text-right {
            text-align: right;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            padding: 20px;
            border-top: 1px solid #f1f5f9;
        }
        .badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            text-transform: uppercase;
            background: #f1f5f9;
            color: #475569;
        }
    </style>
</head>
<body>
    <div class="header">
        <!-- Assuming logo is available in public path, otherwise text -->
        <h1 class="title">Apartments24</h1>
        <p class="subtitle">Financial Statement • {{ $month }} {{ $year }}</p>
    </div>

    <div class="summary-grid">
        <div class="summary-card">
            <div class="card-title">Total Revenue</div>
            <div class="card-value">{{ number_format($financials['total_revenue'], 2) }} USD</div>
        </div>
        <div class="summary-card" style="background-color: #f0fdf4; border-color: #bbf7d0;">
            <div class="card-title" style="color: #166534;">Admin Commission</div>
            <div class="card-value" style="color: #15803d;">{{ number_format($financials['admin_commission'], 2) }} USD</div>
        </div>
        <div class="summary-card" style="background-color: #fff7ed; border-color: #fed7aa;">
            <div class="card-title" style="color: #9a3412;">Owner Payout</div>
            <div class="card-value" style="color: #c2410c;">{{ number_format($financials['owner_share'], 2) }} USD</div>
        </div>
        <div class="summary-card">
            <div class="card-title">Recorded Expenses</div>
            <div class="card-value">{{ number_format($financials['expenses'], 2) }} USD</div>
        </div>
    </div>

    <div class="content">
        <h3 class="section-title">Booking Details</h3>
        <table>
            <thead>
                <tr>
                    <th>Apartment</th>
                    <th>Guest</th>
                    <th>Check-in</th>
                    <th class="text-right">Total</th>
                    <th class="text-right">Owner (65%)</th>
                    <th class="text-right">Admin (35%)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($bookings as $booking)
                <tr>
                    <td>{{ $booking->apartment->name }}</td>
                    <td>{{ $booking->guest_name }}</td>
                    <td>{{ $booking->check_in_date->format('d M Y') }}</td>
                    <td class="text-right">{{ number_format($booking->total_price, 2) }}</td>
                    <td class="text-right">{{ number_format($booking->net_revenue, 2) }}</td>
                    <td class="text-right">{{ number_format($booking->total_price - $booking->net_revenue, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        @if(count($expenses_list) > 0)
        <h3 class="section-title">Expense Breakdown</h3>
        <table>
            <thead>
                <tr>
                    <th>Apartment</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($expenses_list as $expense)
                <tr>
                    <td>{{ $expense->apartment->name }}</td>
                    <td>{{ $expense->description }}</td>
                    <td>{{ $expense->date->format('d M Y') }}</td>
                    <td class="text-right">{{ number_format($expense->amount, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif
    </div>

    <div class="footer">
        Generated on {{ now()->format('d M Y H:i') }} • Apartments24 Administrative Report
    </div>
</body>
</html>
