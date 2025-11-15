<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Orders Export</title>
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
                <p><strong>Orders Export</strong></p>
                <p>Export Date: {{ $exportDate }}</p>
                <p>Total Records: {{ $orders->count() }}</p>
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
                <th>Order #</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Branch</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Payment Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($orders as $order)
            <tr>
                <td>{{ $order->order_number }}</td>
                <td>{{ $order->order_date->format('Y-m-d') }}</td>
                <td>{{ $order->customer->first_name ?? '' }} {{ $order->customer->last_name ?? '' }}</td>
                <td>{{ $order->branch->branch_name ?? 'N/A' }}</td>
                <td class="text-center">{{ $order->items->count() }}</td>
                <td class="text-right">₹{{ number_format($order->total_amount, 2) }}</td>
                <td class="text-right">₹{{ number_format($order->paid_amount, 2) }}</td>
                <td class="text-right">₹{{ number_format($order->remaining_amount, 2) }}</td>
                <td class="text-center">{{ ucfirst($order->status) }}</td>
                <td class="text-center">{{ ucfirst($order->payment_status) }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="10" class="text-center">No orders found</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Generated on {{ $exportDate }} | {{ $settings['business_name'] ?? 'Photo Studio Management' }}</p>
    </div>
</body>
</html>

