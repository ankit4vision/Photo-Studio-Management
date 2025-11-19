<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>INV-{{ $order->order_number ?? $order->id }}_{{ $settings['invoice_business_name'] ?? $settings['business_name'] ?? 'Invoice' }}</title>
    @include('pdfs.partials.styles')
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

        $customer = $order->customer;
        $customerName = trim(($customer->first_name ?? '') . ' ' . ($customer->last_name ?? ''));
        $customerCode = $customer->customer_code ?? 'N/A';
        $customerPhone = $customer->phone ?? $customer->mobile ?? 'N/A';
        $customerAddress = implode(', ', array_filter([
            $customer->address ?? null,
            $customer->city ?? null,
            $customer->state ?? null,
            $customer->postal_code ?? null,
            $customer->country ?? null,
        ]));
        if(blank($customerAddress)) {
            $customerAddress = '—';
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

    <div class="page">

        <!-- HEADER -->
        <div class="header">
            <div class="biz">{{ $businessName }}</div>
            <div class="biz-sub">
                @if($businessAddress)
                    {{ $businessAddress }}<br>
                @endif
                Branch: {{ $branchName }}@if($branchCode) ({{ $branchCode }})@endif<br>
                @if($businessEmail)
                    Email: {{ $businessEmail }}<br>
                @endif
                @if($businessPhone)
                    Phone: {{ $businessPhone }}
                @endif
            </div>
        </div>

        <div class="dd-hr"></div>

        <!-- INVOICE BODY -->
        <div class="body-row">
            <div class="left">
                <div class="inv-title">INVOICE</div>
                <div class="meta">
                    <div><strong>Invoice #:</strong> {{ $invoiceNumber }}</div>
                    <div><strong>Date & Time:</strong> {{ $invoiceDate }}, {{ $invoiceTime }}</div>
                </div>
            </div>
            <div class="right" style="text-align:right;">
                <div style="font-weight:600; font-size:12px;">Customer</div>
                <div class="cust">
                    <div><strong>Code:</strong> {{ $customerCode }}</div>
                    <div><strong>Name:</strong> {{ $customerName }}</div>
                    <div><strong>Phone:</strong> {{ $customerPhone }}</div>
                    <div><strong>Address:</strong> {{ $customerAddress }}</div>
                </div>
            </div>
        </div>

        <div class="dd-hr"></div>

        <!-- PACKAGES -->
        <div class="section-title">PACKAGES</div>

        <table class="invoice-table">
            <thead>
                <tr>
                    <th style="width:32px;">#</th>
                    <th>PRODUCT</th>
                    <th style="width:40px; text-align:right;">QTY</th>
                    <th style="width:80px; text-align:right;">PRICE</th>
                    <th style="width:80px; text-align:right;">DISCOUNT</th>
                    <th style="width:90px; text-align:right;">SUBTOTAL</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $index => $item)
                    @php 
                        $lineDiscount = $item->discount ?? 0;
                        $itemSubtotal = ($item->total_price ?? 0) - $lineDiscount;
                        $productName = $item->package_name ?? 'N/A';
                        if($item->package_type) {
                            $productName .= ' (' . $item->package_type . ')';
                        }
                    @endphp
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td class="product-col">{{ $productName }}</td>
                        <td class="num">{{ $item->quantity ?? 1 }}</td>
                        <td class="num">₹{{ number_format($item->unit_price ?? 0, 2) }}</td>
                        <td class="num">₹{{ number_format($lineDiscount, 2) }}</td>
                        <td class="num">₹{{ number_format($itemSubtotal, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- ORDER SUMMARY BELOW TABLE -->
        <div class="order-summary-block">
            <div class="line">Subtotal: <strong>₹{{ number_format($subtotal, 2) }}</strong></div>
            <div class="line">Total Discount: <strong>₹{{ number_format($discountAmount, 2) }}</strong></div>
            <div class="grand line">Grand Total: <strong>₹{{ number_format($totalAmount, 2) }}</strong></div>
            <div class="line">Paid: <strong>₹{{ number_format($paidAmount, 2) }}</strong></div>
            <div class="line">Due: <strong>₹{{ number_format($remainingAmount, 2) }}</strong></div>
        </div>

        <!-- PAYMENT BREAKDOWN -->
        @if($order->payments && $order->payments->count() > 0)
            <div class="payments">
                <div class="section-title">PAYMENT BREAKDOWN</div>
                @foreach($order->payments as $payment)
                    @php
                        $paymentDate = optional($payment->payment_date)->format('d M Y') ?? 'N/A';
                        $paymentMethod = \Illuminate\Support\Str::title(str_replace('_', ' ', $payment->payment_method ?? 'N/A'));
                        $paymentType = \Illuminate\Support\Str::title($payment->payment_type ?? 'N/A');
                        $paymentAmount = number_format($payment->amount ?? 0, 2);
                    @endphp
                    <div>#{{ $payment->payment_number ?? 'N/A' }} - {{ $paymentDate }} - {{ $paymentMethod }} - {{ $paymentType }} - ₹{{ $paymentAmount }}</div>
                @endforeach
            </div>
        @endif

        <div class="dd-hr" style="margin-top:12px;"></div>

        <!-- FOOTER -->
        <div class="footer">
            {{ $businessName }}@if($businessWebsite) • {{ $businessWebsite }}@endif<br>
            @if($businessEmail || $businessPhone)
                {{ $businessEmail }}{{ $businessEmail && $businessPhone ? ' • ' : '' }}{{ $businessPhone }}<br>
            @endif
            <div style="margin-top:6px;">Thank you!</div>
        </div>

    </div>
</body>
</html>
