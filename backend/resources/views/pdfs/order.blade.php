<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Invoice - {{ $order->order_number }}</title>
    @include('pdfs.partials.styles')
</head>
<body class="invoice-body">
    @php
        $exportedAt = \Carbon\Carbon::parse($exportDate ?? now());
        $invoicePrefix = trim($settings['invoice_prefix'] ?? '');
        $orderNumber = $order->order_number ?? $order->id;
        $invoiceNumber = $invoicePrefix !== '' ? $invoicePrefix . '-' . $orderNumber : $orderNumber;
        $invoiceDate = optional($order->order_date)->format('d M Y') ?? $exportedAt->format('d M Y');
        $invoiceTime = $exportedAt->format('h:i A');
        $invoiceTitle = strtoupper($settings['invoice_title'] ?? 'Invoice');

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
        $customerName = trim(($customer->salutation ?? '') . ' ' . $customer->first_name . ' ' . $customer->last_name);
        $customerCode = $customer->customer_code ?? 'N/A';
        $customerPhone = $customer->phone ?? $customer->mobile ?? 'N/A';
        $customerEmail = $customer->email ?? 'N/A';
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
        $branchContact = $branch->contact_number ?? 'N/A';
        $branchAddress = implode(', ', array_filter([
            $branch->address ?? null,
            $branch->city ?? null,
            $branch->state ?? null,
            $branch->postal_code ?? null,
        ]));
        if(blank($branchAddress)) {
            $branchAddress = null;
        }

        $discountAmount = $order->discount ?? $order->flat_discount ?? 0;
    @endphp

    <div class="invoice-masthead">
        <div class="masthead-left">
            <p class="masthead-title">{{ $businessName }}</p>
        </div>
        <div class="masthead-right">
            @if($businessAddress)
                <p>{{ $businessAddress }}</p>
            @endif
            <p>Branch: {{ $branchName }}@if($branchCode) ({{ $branchCode }})@endif</p>
            @if($businessEmail)
                <p>Email: {{ $businessEmail }}</p>
            @endif
            @if($businessPhone)
                <p>Phone: {{ $businessPhone }}</p>
            @endif
        </div>
    </div>

    <div class="invoice-info-row">
        <div class="info-block">
            <p class="info-label">Invoice</p>
            <p class="info-line">Invoice #: {{ $invoiceNumber }}</p>
            <p class="info-line">Date & Time: {{ $invoiceDate }} • {{ $invoiceTime }}</p>
            <p class="info-line">Payment Status: {{ \Illuminate\Support\Str::title($order->payment_status) }}</p>
        </div>
        <div class="info-block">
            <p class="info-label">Customer</p>
            <p class="info-line">Code: {{ $customerCode }}</p>
            <p class="info-line">Name: {{ $customerName }}</p>
            <p class="info-line">Phone: {{ $customerPhone }}</p>
            <p class="info-line">Address: {{ $customerAddress }}</p>
        </div>
    </div>

    <div class="line-section">
        <div class="section-title">Products</div>
        <div class="products-grid">
            <div class="products-table">
                <table class="line-items">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th class="text-center">Qty</th>
                            <th class="text-right">Price</th>
                            <th class="text-right">Discount</th>
                            <th class="text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($order->items as $index => $item)
                            @php $lineDiscount = $item->discount ?? 0; @endphp
                            <tr>
                                <td>{{ $index + 1 }}</td>
                                <td>
                                    <strong>{{ $item->package_name ?? 'N/A' }}</strong><br>
                                    <span class="muted">{{ $item->package_type ?? 'Package' }}</span>
                                </td>
                                <td class="text-center">{{ $item->quantity }}</td>
                                <td class="text-right">₹{{ number_format($item->unit_price, 2) }}</td>
                                <td class="text-right">₹{{ number_format($lineDiscount, 2) }}</td>
                                <td class="text-right">₹{{ number_format($item->total_price - $lineDiscount, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                <p class="muted" style="margin-top:6px;">Total Items: {{ $order->items->count() }} • Total Qty: {{ $order->items->sum('quantity') }}</p>
            </div>
            <div class="order-summary">
                <table>
                    <tr>
                        <td>Subtotal</td>
                        <td class="text-right">₹{{ number_format($order->subtotal, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Total Discount</td>
                        <td class="text-right">₹{{ number_format($discountAmount, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Grand Total</td>
                        <td class="text-right">₹{{ number_format($order->total_amount, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Paid</td>
                        <td class="text-right text-success">₹{{ number_format($order->paid_amount, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Due</td>
                        <td class="text-right text-danger">₹{{ number_format($order->remaining_amount, 2) }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    @if($order->payments && $order->payments->count() > 0)
        <div class="line-section">
            <div class="section-title">Payment Breakdown</div>
            <div class="payment-lines">
                @foreach($order->payments as $payment)
                    <div class="payment-line">
                        #{{ $payment->payment_number }} - {{ optional($payment->payment_date)->format('d M Y') ?? 'N/A' }} - {{ \Illuminate\Support\Str::title(str_replace('_', ' ', $payment->payment_method)) }} - {{ \Illuminate\Support\Str::title($payment->payment_type) }} - ₹{{ number_format($payment->amount, 2) }}
                    </div>
                @endforeach
            </div>
        </div>
    @endif

    @include('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate])
</body>
</html>
