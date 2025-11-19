<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>INVOICE #{{ $order->order_number ?? $order->id }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 18px 18px 12px 18px;
            font-size: 12px;
            color: #222;
        }
        .top-bar {
            width: 100%;
            display: table;
            margin-bottom: 10px;
        }
        .top-bar .left {
            display: table-cell;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 1px;
            vertical-align: middle;
            text-transform: uppercase;
        }
        .top-bar .right {
            display: table-cell;
            text-align: right;
            vertical-align: middle;
            font-size: 12px;
        }
        .top-bar .meta-row {
            margin-bottom: 0;
        }
        .company-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 2px;
            letter-spacing: 0.5px;
        }
        .company-meta {
            font-size: 12px;
            color: #555;
            margin-bottom: 1px;
        }
        .header-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 0;
            margin-bottom: 10px;
        }
        .header-table td {
            vertical-align: top;
            padding: 0 4px 0 0;
        }
        .header-table .company-cell {
            width: 50%;
        }
        .header-table .info-cell {
            width: 50%;
            text-align: right;
        }
        .info-table {
            width: 100%;
            margin-bottom: 6px;
        }
        .info-table td {
            padding: 1px 4px 1px 0;
            font-size: 12px;
        }
        .section-title {
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 6px;
            margin-top: 16px;
            letter-spacing: 0.5px;
            color: #2d2d2d;
            text-transform: uppercase;
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 4px;
        }
        .products-table th {
            background: #f2f2f2;
            font-weight: bold;
            font-size: 12px;
            padding: 5px 3px;
            border: 1px solid #e0e0e0;
        }
        .products-table th.text-center {
            text-align: center;
        }
        .products-table th.text-start {
            text-align: left;
        }
        .products-table th.text-end {
            text-align: right;
        }
        .products-table td {
            border: 1px solid #e0e0e0;
            padding: 5px 3px;
            font-size: 12px;
        }
        .products-table td.text-center {
            text-align: center;
        }
        .products-table td.text-start {
            text-align: left;
        }
        .products-table td.text-end {
            text-align: right;
        }
        .products-table tr:last-child td {
            border: 1px solid #e0e0e0;
        }
        .totals-row {
            font-size: 12px;
            margin-bottom: 10px;
            margin-top: 2px;
        }
        .totals-row strong {
            font-weight: 600;
        }
        .bottom-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 0;
            margin-top: 10px;
        }
        .bottom-table td {
            vertical-align: top;
            padding: 0 4px 0 0;
        }
        .payment-list {
            font-size: 12px;
            margin: 0;
            padding-left: 14px;
        }
        .payment-list li {
            margin-bottom: 2px;
        }
        .summary-table {
            width: 100%;
            margin-top: 0;
            border-spacing: 0;
        }
        .summary-table td {
            padding: 4px 3px;
            font-size: 12px;
        }
        .summary-table .label {
            text-align: right;
            color: #555;
        }
        .summary-table .value {
            text-align: right;
            font-weight: bold;
            color: #222;
        }
        .summary-table .final {
            font-size: 13px;
            border-top: 1px solid #333;
            padding-top: 5px;
            color: #1a1a1a;
        }
        .footer {
            margin-top: 24px;
            text-align: center;
            font-size: 12px;
            color: #333;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    @php
        $exportedAt = \Carbon\Carbon::parse($exportDate ?? now());
        $invoicePrefix = trim($settings['invoice_prefix'] ?? 'INV');
        $orderNumber = $order->order_number ?? $order->id;
        $invoiceNumber = $invoicePrefix !== '' ? $invoicePrefix . '-' . $orderNumber : $orderNumber;
        $invoiceDate = optional($order->order_date)->format('d M Y') ?? $exportedAt->format('d M Y');
        $invoiceTime = $exportedAt->format('h:i A');

        $businessName = $settings['invoice_business_name']
            ?? $settings['business_name']
            ?? 'Photo Studio Management';
        $businessAddress = $settings['invoice_business_address']
            ?? $settings['business_address']
            ?? null;
        $businessPhone = $settings['invoice_contact_phone']
            ?? $settings['business_phone']
            ?? null;
        $businessEmail = $settings['invoice_contact_email']
            ?? $settings['business_email']
            ?? null;
        $businessWebsite = $settings['invoice_business_website']
            ?? $settings['business_website']
            ?? null;
        $footerText = $settings['invoice_footer_text']
            ?? 'Thank you for your business!';

        $customer = $order->customer;
        $customerName = trim(($customer->first_name ?? '') . ' ' . ($customer->last_name ?? ''));
        $customerCode = $customer->customer_code ?? 'N/A';
        $customerPhone = $customer->phone ?? $customer->mobile ?? 'N/A';
        $customerEmail = $customer->email ?? null;
        $customerAddress = implode(', ', array_filter([
            $customer->address ?? null,
            $customer->city ?? null,
            $customer->state ?? null,
            $customer->postal_code ?? null,
            $customer->country ?? null,
        ]));
        if(blank($customerAddress)) {
            $customerAddress = '-';
        }

        $branch = $order->branch;
        $branchName = $branch->branch_name ?? 'N/A';
        $branchCode = $branch->branch_code ?? null;

        $discountAmount = $order->discount ?? $order->flat_discount ?? 0;
        $subtotal = $order->subtotal ?? 0;
        $totalAmount = $order->total_amount ?? 0;
        $paidAmount = $order->paid_amount ?? 0;
        $remainingAmount = $order->remaining_amount ?? 0;
    @endphp

    <!-- Top Bar: INVOICE (left) and Invoice Meta (right) -->
    <div class="top-bar">
        <div class="left">INVOICE</div>
        <div class="right">
            <div class="meta-row"><strong>Invoice #:</strong> {{ $invoiceNumber }}</div>
            <div class="meta-row"><strong>Date:</strong> {{ $invoiceDate }}</div>
            <div class="meta-row"><strong>Time:</strong> {{ $invoiceTime }}</div>
        </div>
    </div>
    <hr style="border:0;border-top:1.5px solid #bbb;margin:0 0 10px 0;">

    <!-- Header: Business and Customer Info (Table) -->
    <table class="header-table">
        <tr>
            <td class="company-cell">
                <div class="company-name">{{ $businessName }}</div>
                @if($businessAddress)
                    <div class="company-meta">{{ $businessAddress }}</div>
                @endif
                @if($branchName)
                    <div class="company-meta">Branch: {{ $branchName }}@if($branchCode) ({{ $branchCode }})@endif</div>
                @endif
                @if($businessEmail)
                    <div class="company-meta">Email: {{ $businessEmail }}</div>
                @endif
                @if($businessPhone)
                    <div class="company-meta">Phone: {{ $businessPhone }}</div>
                @endif
            </td>
            <td class="info-cell">
                <div class="company-name">{{ $customerName ?: 'Walk-in' }}</div>
                <div class="company-meta">Code: {{ $customerCode }}</div>
                <div class="company-meta">Phone: {{ $customerPhone }}</div>
                @if($customerEmail)
                    <div class="company-meta">Email: {{ $customerEmail }}</div>
                @endif
                @if($customerAddress && $customerAddress !== '-')
                    <div class="company-meta">Address: {{ $customerAddress }}</div>
                @endif
            </td>
        </tr>
    </table>

    <!-- Packages List -->
    <div class="section-title">Packages</div>
    <table class="products-table">
        <thead>
            <tr>
                <th class="text-center">#</th>
                <th class="text-start">Product</th>
                <th class="text-center">Qty</th>
                <th class="text-end">Price</th>
                <th class="text-end">Discount</th>
                <th class="text-end">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @php $totalQty = 0; @endphp
            @foreach($order->items as $idx => $item)
                @php 
                    $totalQty += $item->quantity ?? 1;
                    $lineDiscount = $item->discount ?? 0;
                    $itemSubtotal = ($item->total_price ?? 0) - $lineDiscount;
                    $productName = $item->package_name ?? 'N/A';
                    if($item->package_type) {
                        $productName .= ' (' . $item->package_type . ')';
                    }
                @endphp
                <tr>
                    <td class="text-center">{{ $idx + 1 }}</td>
                    <td class="text-start">{{ $productName }}</td>
                    <td class="text-center">{{ $item->quantity ?? 1 }}</td>
                    <td class="text-end">₹{{ number_format($item->unit_price ?? 0, 2) }}</td>
                    <td class="text-end">{{ $lineDiscount > 0 ? '₹' . number_format($lineDiscount, 2) : '-' }}</td>
                    <td class="text-end">₹{{ number_format($itemSubtotal, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
    <div class="totals-row">
        <strong>Total Items:</strong> {{ count($order->items) }} &nbsp; | &nbsp; <strong>Total Qty:</strong> {{ $totalQty }}
    </div>

    <!-- Bottom: Two Columns (Table) -->
    <table class="bottom-table">
        <tr>
            <td style="width:50%;vertical-align:top;">
                <div class="section-title">Payment Breakdown</div>
                @if($order->payments && $order->payments->count() > 0)
                    <ul class="payment-list">
                        @foreach($order->payments as $payment)
                            @php
                                $paymentDate = optional($payment->payment_date)->format('d M Y') ?? 'N/A';
                                $paymentMethod = \Illuminate\Support\Str::title(str_replace('_', ' ', $payment->payment_method ?? 'N/A'));
                                $paymentType = \Illuminate\Support\Str::title($payment->payment_type ?? 'N/A');
                                $paymentAmount = number_format($payment->amount ?? 0, 2);
                            @endphp
                            <li>
                                <strong>{{ strtoupper($payment->payment_number ?? 'N/A') }}:</strong>
                                ₹{{ $paymentAmount }}
                                <span style="color:#888;">- {{ $paymentDate }} - {{ $paymentMethod }} - {{ $paymentType }}</span>
                            </li>
                        @endforeach
                    </ul>
                @else
                    <div style="color:#888;">No payment info available.</div>
                @endif
            </td>
            <td style="width:50%;vertical-align:top;">
                <div class="section-title" style="text-align:right;">SUMMARY</div>
                <table class="summary-table">
                    <tr>
                        <td class="label">Subtotal:</td>
                        <td class="value">₹{{ number_format($subtotal, 2) }}</td>
                    </tr>
                    <tr>
                        <td class="label">Total Discount:</td>
                        <td class="value">₹{{ number_format($discountAmount, 2) }}</td>
                    </tr>
                    <tr>
                        <td class="label">Grand Total:</td>
                        <td class="value">₹{{ number_format($totalAmount, 2) }}</td>
                    </tr>
                    <tr class="final">
                        <td class="label">Final Payable:</td>
                        <td class="value">₹{{ number_format($totalAmount, 2) }}</td>
                    </tr>
                    <tr>
                        <td class="label">Paid:</td>
                        <td class="value">₹{{ number_format($paidAmount, 2) }}</td>
                    </tr>
                    <tr>
                        <td class="label">Due:</td>
                        <td class="value">₹{{ number_format($remainingAmount, 2) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <div class="footer">
        {{ $footerText }}
    </div>
</body>
</html>

