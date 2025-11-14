<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Invoice - {{ $order->order_number }}</title>
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
            align-items: flex-start;
            margin-bottom: 20px;
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
        .invoice-info {
            text-align: right;
        }
        .invoice-info h2 {
            color: #8b5cf6;
            font-size: 28px;
            margin-bottom: 10px;
        }
        .invoice-info p {
            margin: 3px 0;
            font-size: 11px;
        }
        .billing-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .billing-box {
            width: 48%;
            padding: 15px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
        }
        .billing-box h3 {
            color: #8b5cf6;
            font-size: 14px;
            margin-bottom: 10px;
            border-bottom: 2px solid #8b5cf6;
            padding-bottom: 5px;
        }
        .billing-box p {
            margin: 5px 0;
            font-size: 11px;
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
        .totals {
            width: 100%;
            margin-left: auto;
            margin-top: 20px;
        }
        .totals table {
            width: 300px;
            margin-left: auto;
        }
        .totals td {
            padding: 8px;
            border: 1px solid #dee2e6;
        }
        .totals td:first-child {
            font-weight: bold;
            background: #f8f9fa;
        }
        .totals .total-row {
            background: #8b5cf6;
            color: white;
            font-weight: bold;
            font-size: 14px;
        }
        .totals .total-row td {
            border: none;
        }
        .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .badge-completed {
            background: #28a745;
            color: white;
        }
        .badge-pending {
            background: #ffc107;
            color: #333;
        }
        .badge-processing {
            background: #17a2b8;
            color: white;
        }
        .badge-paid {
            background: #28a745;
            color: white;
        }
        .badge-partial {
            background: #ffc107;
            color: #333;
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
                @if(isset($settings['tax_number']))
                <p>Tax ID: {{ $settings['tax_number'] }}</p>
                @endif
            </div>
            <div class="invoice-info">
                <h2>INVOICE</h2>
                <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
                <p><strong>Order Date:</strong> {{ $order->order_date->format('Y-m-d') }}</p>
                @if($order->due_date)
                <p><strong>Due Date:</strong> {{ $order->due_date->format('Y-m-d') }}</p>
                @endif
                <p><strong>Status:</strong> <span class="badge badge-{{ $order->status }}">{{ strtoupper($order->status) }}</span></p>
                <p><strong>Payment Status:</strong> <span class="badge badge-{{ $order->payment_status }}">{{ strtoupper($order->payment_status) }}</span></p>
            </div>
        </div>
    </div>

    <div class="billing-section">
        <div class="billing-box">
            <h3>Bill To:</h3>
            <p><strong>{{ $order->customer->first_name }} {{ $order->customer->last_name }}</strong></p>
            <p>{{ $order->customer->email ?? '' }}</p>
            <p>{{ $order->customer->phone ?? $order->customer->mobile ?? '' }}</p>
            <p>{{ $order->customer->address ?? '' }}</p>
            <p>{{ $order->customer->city ?? '' }}, {{ $order->customer->state ?? '' }}</p>
            <p>{{ $order->customer->postal_code ?? '' }}, {{ $order->customer->country ?? '' }}</p>
        </div>
        <div class="billing-box">
            <h3>Branch Information:</h3>
            @if($order->branch)
            <p><strong>{{ $order->branch->branch_name }}</strong></p>
            <p>{{ $order->branch->address ?? '' }}</p>
            <p>{{ $order->branch->city ?? '' }}, {{ $order->branch->state ?? '' }}</p>
            <p>Phone: {{ $order->branch->contact_number ?? '' }}</p>
            @else
            <p>N/A</p>
            @endif
        </div>
    </div>

    <div class="section">
        <div class="section-title">Order Items</div>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Package Name</th>
                    <th>Type</th>
                    <th class="text-center">Quantity</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->package_name ?? 'N/A' }}</td>
                    <td>{{ $item->package_type ?? 'N/A' }}</td>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td class="text-right">₹{{ number_format($item->unit_price, 2) }}</td>
                    <td class="text-right">₹{{ number_format($item->total_price, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="totals">
        <table>
            <tr>
                <td>Subtotal:</td>
                <td class="text-right">₹{{ number_format($order->subtotal, 2) }}</td>
            </tr>
            @if($order->discount > 0)
            <tr>
                <td>Discount:</td>
                <td class="text-right">-₹{{ number_format($order->discount, 2) }}</td>
            </tr>
            @endif
            <tr class="total-row">
                <td>Total Amount:</td>
                <td class="text-right">₹{{ number_format($order->total_amount, 2) }}</td>
            </tr>
            <tr>
                <td>Paid Amount:</td>
                <td class="text-right">₹{{ number_format($order->paid_amount, 2) }}</td>
            </tr>
            <tr class="total-row">
                <td>Balance Amount:</td>
                <td class="text-right">₹{{ number_format($order->balance_amount, 2) }}</td>
            </tr>
        </table>
    </div>

    @if($order->payments && $order->payments->count() > 0)
    <div class="section">
        <div class="section-title">Payment History</div>
        <table>
            <thead>
                <tr>
                    <th>Payment #</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Method</th>
                    <th class="text-right">Amount</th>
                    <th>Remarks</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->payments as $payment)
                <tr>
                    <td>{{ $payment->payment_number }}</td>
                    <td>{{ $payment->payment_date->format('Y-m-d') }}</td>
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

    @if($order->notes)
    <div class="section">
        <div class="section-title">Notes</div>
        <p style="padding: 10px; background: #f8f9fa; border-left: 3px solid #8b5cf6;">{{ $order->notes }}</p>
    </div>
    @endif

    <div class="footer">
        <p>Generated on {{ $exportDate }} | {{ $settings['business_name'] ?? 'Photo Studio Management' }}</p>
        <p>Thank you for your business!</p>
    </div>
</body>
</html>

