<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Invoice - {{ $order->order_number }}</title>
    @include('pdfs.partials.styles')
</head>
<body>
    @include('pdfs.partials.header', [
        'settings' => $settings,
        'title' => 'Order Invoice',
        'meta' => [
            'Order #' => $order->order_number,
            'Order Date' => optional($order->order_date)->format('Y-m-d'),
            'Due Date' => optional($order->due_date)->format('Y-m-d'),
            'Status' => ucfirst($order->status),
            'Payment Status' => ucfirst($order->payment_status),
        ]
    ])

    <div class="pdf-section">
        <div class="section-heading">
            <div class="section-title">Order Snapshot</div>
            <div class="section-subtitle">Financial status at export time</div>
        </div>
        <div class="summary-cards">
            <div class="summary-card">
                <span class="summary-label">Order Total</span>
                <span class="summary-value">₹{{ number_format($order->total_amount, 2) }}</span>
                <span class="summary-foot">Subtotal ₹{{ number_format($order->subtotal, 2) }}</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Items</span>
                <span class="summary-value">{{ $order->items->count() }}</span>
                <span class="summary-foot">Packages included</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Paid</span>
                <span class="summary-value">₹{{ number_format($order->paid_amount, 2) }}</span>
                <span class="summary-foot">Status: {{ strtoupper($order->payment_status) }}</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Remaining</span>
                <span class="summary-value">₹{{ number_format($order->remaining_amount, 2) }}</span>
                <span class="summary-foot">Due by {{ optional($order->due_date)->format('Y-m-d') ?? 'N/A' }}</span>
            </div>
        </div>
    </div>

    <div class="pdf-section">
        <div class="section-heading">
            <div class="section-title">Bill To & Fulfilment</div>
        </div>
        <table class="info-table">
            <tr>
                <th>Customer</th>
                <td>{{ $order->customer->first_name }} {{ $order->customer->last_name }}</td>
                <th>Customer Code</th>
                <td>{{ $order->customer->customer_code ?? 'N/A' }}</td>
            </tr>
            <tr>
                <th>Contact</th>
                <td>{{ $order->customer->email ?? 'N/A' }} • {{ $order->customer->phone ?? $order->customer->mobile ?? 'N/A' }}</td>
                <th>Address</th>
                <td>{{ $order->customer->address ?? '—' }}, {{ $order->customer->city ?? '' }} {{ $order->customer->state ?? '' }} {{ $order->customer->postal_code ?? '' }}</td>
            </tr>
            <tr>
                <th>Branch</th>
                <td>{{ $order->branch->branch_name ?? 'N/A' }}</td>
                <th>Branch Contact</th>
                <td>{{ $order->branch->contact_number ?? 'N/A' }}</td>
            </tr>
        </table>
    </div>

    <div class="pdf-section">
        <div class="section-title">Order Items</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Package</th>
                    <th>Type</th>
                    <th class="text-center">Qty</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total</th>
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

    <div class="pdf-section">
        <div class="section-title">Order Summary</div>
        <table class="summary-table">
            <tr>
                <td>Subtotal</td>
                <td class="text-right">₹{{ number_format($order->subtotal, 2) }}</td>
            </tr>
            @if($order->discount > 0)
                <tr>
                    <td>Discount</td>
                    <td class="text-right">-₹{{ number_format($order->discount, 2) }}</td>
                </tr>
            @endif
            <tr>
                <td>Paid Amount</td>
                <td class="text-right">₹{{ number_format($order->paid_amount, 2) }}</td>
            </tr>
            <tr>
                <td>Remaining Amount</td>
                <td class="text-right">₹{{ number_format($order->remaining_amount, 2) }}</td>
            </tr>
            <tr>
                <td>Total</td>
                <td class="text-right">₹{{ number_format($order->total_amount, 2) }}</td>
            </tr>
        </table>
    </div>

    @if($order->payments && $order->payments->count() > 0)
        <div class="pdf-section">
            <div class="section-title">Payment History</div>
            <table class="data-table">
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
                            <td>{{ optional($payment->payment_date)->format('Y-m-d') }}</td>
                            <td>{{ ucfirst($payment->payment_type) }}</td>
                            <td>{{ ucfirst(str_replace('_', ' ', $payment->payment_method)) }}</td>
                            <td class="text-right">₹{{ number_format($payment->amount, 2) }}</td>
                            <td>{{ $payment->remarks ?? '—' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    @if($order->notes)
        <div class="pdf-section">
            <div class="section-title">Notes</div>
            <div class="section-card">{{ $order->notes }}</div>
        </div>
    @endif

    @include('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate])
</body>
</html>
