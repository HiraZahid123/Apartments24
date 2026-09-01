<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Owner Financial Statement - {{ $month }} {{ $year }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #334155;
            line-height: 1.5;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 20px;
        }
        .title {
            font-size: 22px;
            font-weight: bold;
            text-transform: uppercase;
            color: #0f172a;
            margin: 0;
            letter-spacing: 0.5px;
        }
        .subtitle {
            font-size: 13px;
            color: #64748b;
            margin-top: 4px;
        }
        .owner-badge {
            margin-top: 10px;
            display: inline-block;
            background-color: #fff7ed;
            color: #c2410c;
            border: 1px solid #fed7aa;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
        }
        .notice {
            background-color: #f8fafc;
            border-left: 3px solid #ff5b22;
            padding: 8px 12px;
            font-size: 10px;
            color: #475569;
            margin-bottom: 20px;
        }
        .summary-grid {
            display: table;
            width: 100%;
            margin-bottom: 25px;
        }
        .summary-card {
            display: table-cell;
            width: 20%;
            padding: 12px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            text-align: center;
        }
        .card-title {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #64748b;
            margin-bottom: 4px;
            font-weight: bold;
        }
        .card-value {
            font-size: 16px;
            font-weight: bold;
            color: #0f172a;
        }
        .section-title {
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            color: #0f172a;
            margin-top: 25px;
            margin-bottom: 10px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-bottom: 20px;
        }
        th {
            text-align: left;
            background-color: #f1f5f9;
            color: #475569;
            padding: 8px 10px;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 0.5px;
        }
        td {
            padding: 8px 10px;
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
            font-size: 9px;
            color: #94a3b8;
            padding: 15px;
            border-top: 1px solid #f1f5f9;
        }
        .status-pill {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 8px;
            text-transform: uppercase;
            font-weight: bold;
            background: #f1f5f9;
            color: #475569;
        }
        .status-confirmed {
            background-color: #fff7ed;
            color: #c2410c;
        }
        .status-checked-in {
            background-color: #ecfdf5;
            color: #047857;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">Apartments24</h1>
        <p class="subtitle">Owner Financial Statement • {{ $month }} {{ $year }}</p>
        <div class="owner-badge">
            Owner: {{ $owner->name }} • Property: {{ $entity_label }}
        </div>
    </div>

    <div class="notice">
        <strong>Payout Schedule Alignment:</strong> Financial metrics are attributed to the month of the reservation's <strong>check-out date</strong> to align directly with the Booking.com payout calendar.
    </div>

    <div class="summary-grid">
        <div class="summary-card">
            <div class="card-title">Total Gross</div>
            <div class="card-value">€{{ number_format($financials['total_revenue'], 2) }}</div>
        </div>
        <div class="summary-card">
            <div class="card-title">Admin Fee</div>
            <div class="card-value">€{{ number_format($financials['admin_commission'], 2) }}</div>
        </div>
        <div class="summary-card" style="background-color: #fff7ed; border-color: #fed7aa;">
            <div class="card-title" style="color: #9a3412;">Net Revenue (Payout)</div>
            <div class="card-value" style="color: #c2410c;">€{{ number_format($financials['owner_share'], 2) }}</div>
        </div>
        <div class="summary-card" style="background-color: #fff1f2; border-color: #fecdd3;">
            <div class="card-title" style="color: #9f1239;">Expenses</div>
            <div class="card-value" style="color: #be123c;">€{{ number_format($financials['expenses'], 2) }}</div>
        </div>
        <div class="summary-card" style="background-color: #f0fdf4; border-color: #bbf7d0;">
            <div class="card-title" style="color: #166534;">Net Earnings</div>
            <div class="card-value" style="color: #15803d;">€{{ number_format($financials['net_earnings'], 2) }}</div>
        </div>
    </div>

    <div class="content">
        <h3 class="section-title">Reservations ({{ count($bookings) }})</h3>
        @if(count($bookings) > 0)
        <table>
            <thead>
                <tr>
                    <th>Apartment</th>
                    <th>Guest</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Nights</th>
                    <th class="text-right">Gross Price</th>
                    <th class="text-right">Admin Share</th>
                    <th class="text-right">Net Revenue</th>
                </tr>
            </thead>
            <tbody>
                @foreach($bookings as $booking)
                <tr>
                    <td><strong>{{ $booking->apartment->name ?? 'N/A' }}</strong></td>
                    <td>{{ $booking->guest_name }}</td>
                    <td>{{ $booking->check_in_date ? $booking->check_in_date->format('d M Y') : 'N/A' }}</td>
                    <td><strong>{{ $booking->check_out_date ? $booking->check_out_date->format('d M Y') : 'N/A' }}</strong></td>
                    <td>{{ $booking->check_in_date && $booking->check_out_date ? max(1, $booking->check_in_date->diffInDays($booking->check_out_date)) : 1 }}</td>
                    <td class="text-right">€{{ number_format($booking->total_price, 2) }}</td>
                    <td class="text-right">€{{ number_format($booking->total_price - $booking->net_revenue, 2) }}</td>
                    <td class="text-right" style="color: #c2410c; font-weight: bold;">€{{ number_format($booking->net_revenue, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
        <p style="font-size: 11px; color: #94a3b8; font-style: italic; margin-bottom: 20px;">No reservations with checkout in this period.</p>
        @endif

        <h3 class="section-title">Expenses ({{ count($expenses_list) }})</h3>
        @if(count($expenses_list) > 0)
        <table>
            <thead>
                <tr>
                    <th>Property / Group</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($expenses_list as $expense)
                <tr>
                    <td><strong>{{ $expense->apartmentGroup?->name ?? $expense->apartment?->name ?? ($expense->apartments->isNotEmpty() ? $expense->apartments->pluck('name')->join(', ') : 'General') }}</strong></td>
                    <td>{{ $expense->description }}</td>
                    <td>{{ $expense->date ? $expense->date->format('d M Y') : 'N/A' }}</td>
                    <td class="text-right" style="color: #be123c; font-weight: bold;">€{{ number_format($expense->amount, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
        <p style="font-size: 11px; color: #94a3b8; font-style: italic; margin-bottom: 20px;">No operational expenses recorded for this period.</p>
        @endif
    </div>

    <div class="footer">
        Generated on {{ now()->format('d M Y H:i') }} • Apartments24 Owner Portal
    </div>
</body>
</html>
