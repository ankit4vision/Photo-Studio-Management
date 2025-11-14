<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Transactions Export</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.5;
        }
        .header {
            border-bottom: 3px solid #8b5cf6;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .company-info h1 {
            color: #8b5cf6;
            font-size: 20px;
            margin-bottom: 5px;
        }
        .company-info p {
            color: #666;
            font-size: 10px;
            margin: 2px 0;
        }
        .report-info {
            text-align: right;
        }
        .report-info p {
            margin: 3px 0;
            font-size: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table th {
            background: #8b5cf6;
            color: white;
            padding: 8px;
            text-align: left;
            font-size: 10px;
            font-weight: bold;
        }
        table td {
            padding: 6px;
            border: 1px solid #dee2e6;
            font-size: 10px;
        }
        table tr:nth-child(even) {
            background: #f8f9fa;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .badge {
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        .badge-credit {
            background: #28a745;
            color: white;
        }
        .badge-debit {
            background: #dc3545;
            color: white;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            font-size: 9px;
            color: #666;
        }
        .filters {
            margin-bottom: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-left: 3px solid #8b5cf6;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-top">
            <div class="company-info">
                <h1>{{ $settings['business_name'] ?? 'Photo Studio Management' }}</h1>
                <p>{{ $settings['business_address'] ?? '' }}</p>
            </div>
            <div class="report-info">
                <p><strong>Transactions Export</strong></p>
                <p>Export Date: {{ $exportDate }}</p>
                <p>Total Records: {{ $payments->count() }}</p>
            </div>
        </div>
    </div>

    @if(!empty($filters))
    <div class="filters">
        <strong>Applied Filters:</strong>
        @foreach($filters as $key => $value)
            @if($value)
                {{ ucfirst(str_replace('_', ' ', $key)) }}: {{ $value }} |
            @endif
        @endforeach
    </div>
    @endif

    <table>
        <thead>
            <tr>
                <th>Payment #</th>
                <th>Date</th>
                <th>Order #</th>
                <th>Customer</th>
                <th>Branch</th>
                <th>Type</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Remarks</th>
            </tr>
        </thead>
        <tbody>
            @forelse($payments as $payment)
            <tr>
                <td>{{ $payment->payment_number }}</td>
                <td>{{ $payment->payment_date->format('Y-m-d') }}</td>
                <td>{{ $payment->order->order_number ?? 'N/A' }}</td>
                <td>{{ $payment->customer->first_name ?? '' }} {{ $payment->customer->last_name ?? '' }}</td>
                <td>{{ $payment->branch->branch_name ?? 'N/A' }}</td>
                <td class="text-center">
                    <span class="badge badge-{{ $payment->payment_type }}">{{ strtoupper($payment->payment_type) }}</span>
                </td>
                <td class="text-center">{{ ucfirst(str_replace('_', ' ', $payment->payment_method)) }}</td>
                <td class="text-right">₹{{ number_format($payment->amount, 2) }}</td>
                <td>{{ $payment->remarks ?? 'N/A' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="9" class="text-center">No transactions found</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Generated on {{ $exportDate }} | {{ $settings['business_name'] ?? 'Photo Studio Management' }}</p>
    </div>
</body>
</html>

