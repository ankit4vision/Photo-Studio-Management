<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Customer Report - {{ $customer->customer_code }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.6;
        }
        .header {
            border-bottom: 3px solid #8b5cf6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .company-info h1 {
            color: #8b5cf6;
            font-size: 24px;
            margin-bottom: 5px;
        }
        .company-info p {
            color: #666;
            font-size: 11px;
            margin: 2px 0;
        }
        .report-info {
            text-align: right;
        }
        .report-info p {
            margin: 3px 0;
            font-size: 11px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            background: #8b5cf6;
            color: white;
            padding: 8px 15px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 15px;
        }
        .info-row {
            display: table-row;
        }
        .info-label {
            display: table-cell;
            font-weight: bold;
            width: 30%;
            padding: 8px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
        }
        .info-value {
            display: table-cell;
            padding: 8px;
            border: 1px solid #dee2e6;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table th {
            background: #8b5cf6;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 11px;
            font-weight: bold;
        }
        table td {
            padding: 8px;
            border: 1px solid #dee2e6;
            font-size: 11px;
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
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .badge-active {
            background: #28a745;
            color: white;
        }
        .badge-suspended {
            background: #dc3545;
            color: white;
        }
        .badge-pending {
            background: #ffc107;
            color: #333;
        }
        .summary-box {
            background: #f8f9fa;
            border: 2px solid #8b5cf6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .summary-box h3 {
            color: #8b5cf6;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .summary-grid {
            display: table;
            width: 100%;
        }
        .summary-item {
            display: table-cell;
            padding: 8px;
            text-align: center;
        }
        .summary-item strong {
            display: block;
            font-size: 18px;
            color: #8b5cf6;
            margin-bottom: 5px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-top">
            <div class="company-info">
                <h1>{{ $settings['business_name'] ?? 'Photo Studio Management' }}</h1>
                <p>{{ $settings['business_address'] ?? '' }}</p>
                <p>Phone: {{ $settings['business_phone'] ?? '' }} | Email: {{ $settings['business_email'] ?? '' }}</p>
            </div>
            <div class="report-info">
                <p><strong>Customer Report</strong></p>
                <p>Export Date: {{ $exportDate }}</p>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Customer Information</div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Customer Code</div>
                <div class="info-value">{{ $customer->customer_code }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Full Name</div>
                <div class="info-value">{{ $customer->first_name }} {{ $customer->last_name }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Email</div>
                <div class="info-value">{{ $customer->email ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Phone</div>
                <div class="info-value">{{ $customer->phone ?? $customer->mobile ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Address</div>
                <div class="info-value">{{ $customer->address ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">City</div>
                <div class="info-value">{{ $customer->city ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">State</div>
                <div class="info-value">{{ $customer->state ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Country</div>
                <div class="info-value">{{ $customer->country ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Postal Code</div>
                <div class="info-value">{{ $customer->postal_code ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Branch</div>
                <div class="info-value">{{ $customer->branch->branch_name ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Status</div>
                <div class="info-value">
                    <span class="badge badge-{{ $customer->status }}">{{ strtoupper($customer->status) }}</span>
                </div>
            </div>
            @if($customer->dob)
            <div class="info-row">
                <div class="info-label">Date of Birth</div>
                <div class="info-value">{{ $customer->dob->format('Y-m-d') }}</div>
            </div>
            @endif
            @if($customer->anniversary_date)
            <div class="info-row">
                <div class="info-label">Anniversary Date</div>
                <div class="info-value">{{ $customer->anniversary_date->format('Y-m-d') }}</div>
            </div>
            @endif
        </div>
    </div>

    <div class="summary-box">
        <h3>Customer Statistics</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <strong>{{ $customer->total_orders ?? 0 }}</strong>
                <span>Total Orders</span>
            </div>
            <div class="summary-item">
                <strong>₹{{ number_format($customer->total_amount ?? 0, 2) }}</strong>
                <span>Total Amount</span>
            </div>
            <div class="summary-item">
                <strong>₹{{ number_format($customer->paid_amount ?? 0, 2) }}</strong>
                <span>Paid Amount</span>
            </div>
            <div class="summary-item">
                <strong>₹{{ number_format($customer->remaining_amount ?? 0, 2) }}</strong>
                <span>Remaining</span>
            </div>
        </div>
    </div>

    @if($orders && $orders->count() > 0)
    <div class="section">
        <div class="section-title">Orders History ({{ $orders->count() }})</div>
        <table>
            <thead>
                <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($orders as $order)
                <tr>
                    <td>{{ $order->order_number }}</td>
                    <td>{{ $order->order_date->format('Y-m-d') }}</td>
                    <td>{{ $order->items->count() }} item(s)</td>
                    <td class="text-right">₹{{ number_format($order->total_amount, 2) }}</td>
                    <td class="text-right">₹{{ number_format($order->paid_amount, 2) }}</td>
                    <td class="text-right">₹{{ number_format($order->remaining_amount, 2) }}</td>
                    <td class="text-center">{{ ucfirst($order->status) }}</td>
                    <td class="text-center">{{ ucfirst($order->payment_status) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    @if($payments && $payments->count() > 0)
    <div class="section">
        <div class="section-title">Payment History ({{ $payments->count() }})</div>
        <table>
            <thead>
                <tr>
                    <th>Payment #</th>
                    <th>Date</th>
                    <th>Order #</th>
                    <th>Type</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Remarks</th>
                </tr>
            </thead>
            <tbody>
                @foreach($payments as $payment)
                <tr>
                    <td>{{ $payment->payment_number }}</td>
                    <td>{{ $payment->payment_date->format('Y-m-d') }}</td>
                    <td>{{ $payment->order->order_number ?? 'N/A' }}</td>
                    <td class="text-center">{{ ucfirst($payment->payment_type) }}</td>
                    <td class="text-center">{{ ucfirst(str_replace('_', ' ', $payment->payment_method)) }}</td>
                    <td class="text-right">₹{{ number_format($payment->amount, 2) }}</td>
                    <td>{{ $payment->remarks ?? 'N/A' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <div class="footer">
        <p>Generated on {{ $exportDate }} | {{ $settings['business_name'] ?? 'Photo Studio Management' }}</p>
    </div>
</body>
</html>

