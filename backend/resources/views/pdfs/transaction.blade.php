<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Transaction Receipt - {{ $payment->payment_number }}</title>
    <style>
        body {
            font-family: "Helvetica Neue", Arial, "DejaVu Sans", sans-serif;
            margin: 18px;
            font-size: 12px;
            color: #222;
            line-height: 1.5;
            background: #fff;
        }
        @page { size: A4; margin: 12mm; }
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .top-bar .left {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .divider {
            border: 0;
            border-top: 1.5px solid #ccc;
            margin: 0 0 12px 0;
        }
        .header-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-bottom: 16px;
        }
        .header-table td {
            vertical-align: top;
            padding: 0 8px 0 0;
        }
        .doc-title {
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .doc-meta div {
            font-size: 11px;
            margin-top: 4px;
        }
        .customer-name {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
        }
        .customer-meta {
            font-size: 11px;
            color: #555;
            margin-bottom: 4px;
        }
        .section-title {
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin-bottom: 6px;
        }
        .section-subtitle {
            font-size: 11px;
            color: #777;
            margin-bottom: 10px;
        }
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 16px;
        }
        .summary-card {
            border: 1px solid #eee;
            border-radius: 6px;
            padding: 12px;
            text-align: center;
        }
        .summary-label {
            display: block;
            font-size: 11px;
            color: #666;
            margin-bottom: 4px;
        }
        .summary-value {
            display: block;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 3px;
        }
        .summary-foot {
            font-size: 10px;
            text-transform: uppercase;
            color: #999;
        }
        .info-table,
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }
        .info-table th,
        .info-table td,
        .data-table th,
        .data-table td {
            border: 1px solid #eee;
            padding: 6px 8px;
            font-size: 11px;
            text-align: left;
        }
        .data-table th {
            background: #f7f7f7;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            font-weight: 600;
        }
        .data-table .text-right { text-align: right; }
        .section-card {
            border: 1px solid #eee;
            border-radius: 6px;
            padding: 12px;
            font-size: 11px;
            line-height: 1.6;
            background: #fafafa;
        }
        .footer {
            margin-top: 24px;
            padding-top: 12px;
            text-align: center;
            font-size: 11px;
            color: #333;
            line-height: 1.6;
        }
        .footer div { margin-bottom: 3px; }
        .footer .footer-name {
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 6px;
        }
        .footer .footer-contact { margin: 4px 0; }
        .footer .footer-text { margin-top: 8px; font-style: italic; }
    </style>
</head>
<body>
    @php
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

        $exportStamp = \Carbon\Carbon::parse($exportDate ?? now())->format('d M Y, h:i A');
        $paymentDate = optional($payment->payment_date)->format('d M Y') ?? 'N/A';
        $customerEntity = $payment->customer
            ?? optional($payment->order)->customer;
        $customerName = trim(($customerEntity->first_name ?? '') . ' ' . ($customerEntity->last_name ?? '')) ?: ($customerEntity->name ?? 'N/A');
        $customerCode = $customerEntity->customer_code ?? 'N/A';
        $customerEmail = $customerEntity->email ?? '—';
        $customerPhone = $customerEntity->phone ?? $customerEntity->mobile ?? '—';
    @endphp

    <div class="top-bar">
        <div class="left">{{ $businessName }}</div>
    </div>
    <hr class="divider">

    <table class="header-table">
        <tr>
            <td class="company-cell">
                <div class="doc-title">Payment Receipt</div>
                <div class="doc-meta">
                    <div><strong>Payment #:</strong> {{ $payment->payment_number }}</div>
                    <div><strong>Payment Date:</strong> {{ $paymentDate }}</div>
                    <div><strong>Type:</strong> {{ ucfirst($payment->payment_type) }} via {{ ucfirst(str_replace('_', ' ', $payment->payment_method)) }}</div>
                    <div><strong>Exported:</strong> {{ $exportStamp }}</div>
                </div>
            </td>
            <td class="info-cell">
                <div class="customer-name">{{ $customerName }}</div>
                <div class="customer-meta">Code: {{ $customerCode }}</div>
                <div class="customer-meta">Email: {{ $customerEmail }}</div>
                <div class="customer-meta">Phone: {{ $customerPhone }}</div>
                @if(!empty($customerEntity->address))
                    <div class="customer-meta">Address: {{ $customerEntity->address }}</div>
                @endif
            </td>
        </tr>
    </table>

    <div class="section-title">Payment Snapshot</div>
    <div class="summary-cards">
        <div class="summary-card">
            <span class="summary-label">Amount</span>
            <span class="summary-value">₹{{ number_format($payment->amount, 2) }}</span>
            <span class="summary-foot">{{ ucfirst($payment->payment_type) }}</span>
        </div>
        <div class="summary-card">
            <span class="summary-label">Payment #</span>
            <span class="summary-value">{{ $payment->payment_number }}</span>
            <span class="summary-foot">Transaction reference</span>
        </div>
        <div class="summary-card">
            <span class="summary-label">Payment Date</span>
            <span class="summary-value">{{ $paymentDate }}</span>
            <span class="summary-foot">{{ ucfirst(str_replace('_', ' ', $payment->payment_method)) }}</span>
        </div>
    </div>

    <div class="section-title">Transaction Details</div>
    <div class="section-subtitle">Audit-ready reference</div>
    <table class="info-table">
        <tr>
            <th>Payment Number</th>
            <td>{{ $payment->payment_number }}</td>
        </tr>
        <tr>
            <th>Payment Date</th>
            <td>{{ $paymentDate }}</td>
        </tr>
        <tr>
            <th>Payment Type</th>
            <td>{{ ucfirst($payment->payment_type) }}</td>
        </tr>
        <tr>
            <th>Payment Method</th>
            <td>{{ ucfirst(str_replace('_', ' ', $payment->payment_method)) }}</td>
        </tr>
        @if($payment->remarks)
            <tr>
                <th>Remarks</th>
                <td>{{ $payment->remarks }}</td>
            </tr>
        @endif
    </table>

    @if($payment->order)
        <div class="section-title" style="margin-top: 16px;">Order Information</div>
        <table class="data-table">
            <tbody>
                <tr>
                    <th>Order Number</th>
                    <td>{{ $payment->order->order_number }}</td>
                    <th>Order Date</th>
                    <td>{{ optional($payment->order->order_date)->format('d M Y') ?? '—' }}</td>
                </tr>
                <tr>
                    <th>Total Amount</th>
                    <td>₹{{ number_format($payment->order->total_amount, 2) }}</td>
                    <th>Payment Status</th>
                    <td>{{ ucfirst($payment->order->payment_status ?? 'n/a') }}</td>
                </tr>
                <tr>
                    <th>Paid Amount</th>
                    <td>₹{{ number_format($payment->order->paid_amount, 2) }}</td>
                    <th>Remaining</th>
                    <td>₹{{ number_format($payment->order->remaining_amount, 2) }}</td>
                </tr>
            </tbody>
        </table>
    @endif

    @if($payment->branch)
        <div class="section-title" style="margin-top: 16px;">Branch Information</div>
        <div class="section-card">
            <strong>{{ $payment->branch->branch_name }}</strong><br>
            {{ $payment->branch->address ?? '' }}<br>
            {{ $payment->branch->city ?? '' }} {{ $payment->branch->state ?? '' }}
        </div>
    @endif

    <div class="footer">
        <div class="footer-name">{{ $businessName }}</div>
        @if($businessAddress)
            <div>{{ $businessAddress }}</div>
        @endif
        @if($payment->branch)
            <div>Branch: {{ $payment->branch->branch_name }}</div>
        @endif
        <div class="footer-contact">
            @if($businessEmail && $businessPhone)
                {{ $businessEmail }} • {{ $businessPhone }}
            @elseif($businessEmail)
                {{ $businessEmail }}
            @elseif($businessPhone)
                {{ $businessPhone }}
            @endif
        </div>
        @if($businessWebsite)
            <div>{{ $businessWebsite }}</div>
        @endif
        <div class="footer-text">{{ $footerText }}</div>
    </div>
</body>
</html>

