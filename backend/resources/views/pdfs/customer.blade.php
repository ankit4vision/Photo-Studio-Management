<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Customer Report - {{ $customer->customer_code }}</title>
    @include('pdfs.partials.styles')
</head>
<body>
    @include('pdfs.partials.header', [
        'settings' => $settings,
        'title' => 'Customer Report',
        'meta' => [
            'Customer #' => $customer->customer_code,
            'Status' => ucfirst($customer->status),
            'Exported' => $exportDate,
        ]
    ])

    @php
        $infoRows = [
            'Customer Name' => trim(($customer->first_name ?? '') . ' ' . ($customer->last_name ?? '')),
            'Customer Code' => $customer->customer_code,
            'Email' => $customer->email ?? 'N/A',
            'Phone' => $customer->phone ?? $customer->mobile ?? 'N/A',
            'Branch' => $customer->branch->branch_name ?? 'N/A',
            'Address' => trim(($customer->address ?? '') . ', ' . ($customer->city ?? '') . ' ' . ($customer->state ?? '') . ' ' . ($customer->postal_code ?? '')),
            'Status' => strtoupper($customer->status ?? 'N/A'),
            'DOB' => optional($customer->dob)->format('Y-m-d') ?? '—',
            'Anniversary' => optional($customer->anniversary_date)->format('Y-m-d') ?? '—',
        ];
    @endphp

    <div class="pdf-section">
        <div class="section-heading">
            <div class="section-title">Customer Information</div>
            <div class="section-subtitle">Profile + contact overview</div>
        </div>
        <table class="info-table">
            @foreach($infoRows as $label => $value)
                <tr>
                    <th>{{ $label }}</th>
                    <td>{{ $value ?: '—' }}</td>
                </tr>
            @endforeach
        </table>
    </div>

    <div class="pdf-section" style="page-break-inside: avoid;">
        <div class="section-heading">
            <div class="section-title">Financial Snapshot</div>
            <div class="section-subtitle">Live totals pulled from orders & payments</div>
        </div>
        <div class="summary-cards">
            <div class="summary-card">
                <span class="summary-label">Total Orders</span>
                <span class="summary-value">{{ $customer->total_orders ?? 0 }}</span>
                <span class="summary-foot">Confirmed Jobs</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Total Amount</span>
                <span class="summary-value">₹{{ number_format($customer->total_amount ?? 0, 2) }}</span>
                <span class="summary-foot">Gross Billing</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Paid Amount</span>
                <span class="summary-value">₹{{ number_format($customer->paid_amount ?? 0, 2) }}</span>
                <span class="summary-foot">Settled</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Remaining</span>
                <span class="summary-value">₹{{ number_format($customer->remaining_amount ?? 0, 2) }}</span>
                <span class="summary-foot">Outstanding</span>
            </div>
        </div>
    </div>

    <div class="page-break"></div>

    @if($orders && $orders->count() > 0)
        <div class="pdf-section">
            <div class="section-title">Order History ({{ $orders->count() }})</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th class="text-right">Total</th>
                        <th class="text-right">Paid</th>
                        <th class="text-right">Remaining</th>
                        <th>Status</th>
                        <th>Payment</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($orders as $order)
                        <tr>
                            <td>{{ $order->order_number }}</td>
                            <td>{{ optional($order->order_date)->format('Y-m-d') }}</td>
                            <td>{{ $order->items->count() }} item(s)</td>
                            <td class="text-right">₹{{ number_format($order->total_amount, 2) }}</td>
                            <td class="text-right">₹{{ number_format($order->paid_amount, 2) }}</td>
                            <td class="text-right">₹{{ number_format($order->remaining_amount, 2) }}</td>
                            <td>{{ ucfirst($order->status) }}</td>
                            <td>{{ ucfirst($order->payment_status) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    @if($payments && $payments->count() > 0)
        <div class="pdf-section">
            <div class="section-title">Payment History ({{ $payments->count() }})</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Payment #</th>
                        <th>Date</th>
                        <th>Order #</th>
                        <th>Type</th>
                        <th>Method</th>
                        <th class="text-right">Amount</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($payments as $payment)
                        <tr>
                            <td>{{ $payment->payment_number }}</td>
                            <td>{{ optional($payment->payment_date)->format('Y-m-d') }}</td>
                            <td>{{ $payment->order->order_number ?? 'N/A' }}</td>
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

    @include('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate])
</body>
</html>

