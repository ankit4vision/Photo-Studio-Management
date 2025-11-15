<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Transaction Receipt - {{ $payment->payment_number }}</title>
    @include('pdfs.partials.styles')
</head>
<body>
    @include('pdfs.partials.header', [
        'settings' => $settings,
        'title' => 'Payment Receipt',
        'meta' => [
            'Payment #' => $payment->payment_number,
            'Date' => optional($payment->payment_date)->format('Y-m-d'),
            'Type' => ucfirst($payment->payment_type),
        ]
    ])

    <div class="pdf-section">
        <div class="summary-cards">
            <div class="summary-card">
                <span class="summary-label">Amount</span>
                <span class="summary-value">₹{{ number_format($payment->amount, 2) }}</span>
                <span class="summary-foot">{{ ucfirst($payment->payment_type) }} via {{ ucfirst(str_replace('_', ' ', $payment->payment_method)) }}</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Payment #</span>
                <span class="summary-value">{{ $payment->payment_number }}</span>
                <span class="summary-foot">Transaction reference</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Payment Date</span>
                <span class="summary-value">{{ optional($payment->payment_date)->format('Y-m-d') ?? 'N/A' }}</span>
                <span class="summary-foot">Value date</span>
            </div>
        </div>
    </div>

    <div class="pdf-section">
        <div class="section-heading">
            <div class="section-title">Transaction Details</div>
            <div class="section-subtitle">Audit-ready reference</div>
        </div>
        <table class="info-table">
            <tr>
                <th>Payment Number</th>
                <td>{{ $payment->payment_number }}</td>
            </tr>
            <tr>
                <th>Payment Date</th>
                <td>{{ optional($payment->payment_date)->format('Y-m-d') ?? 'N/A' }}</td>
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
    </div>

    @if($payment->order)
        <div class="pdf-section">
            <div class="section-title">Order Information</div>
            <table class="data-table">
                <tbody>
                    <tr>
                        <th>Order Number</th>
                        <td>{{ $payment->order->order_number }}</td>
                        <th>Order Date</th>
                        <td>{{ optional($payment->order->order_date)->format('Y-m-d') }}</td>
                    </tr>
                    <tr>
                        <th>Total Amount</th>
                        <td>₹{{ number_format($payment->order->total_amount, 2) }}</td>
                        <th>Payment Status</th>
                        <td>{{ ucfirst($payment->order->payment_status) }}</td>
                    </tr>
                    <tr>
                        <th>Paid Amount</th>
                        <td>₹{{ number_format($payment->order->paid_amount, 2) }}</td>
                        <th>Remaining</th>
                        <td>₹{{ number_format($payment->order->remaining_amount, 2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    @endif

    @if($payment->customer)
        <div class="pdf-section">
            <div class="section-title">Customer Information</div>
            <div class="section-card">
                <strong>{{ $payment->customer->first_name }} {{ $payment->customer->last_name }}</strong><br>
                Code: {{ $payment->customer->customer_code }}<br>
                {{ $payment->customer->email ?? 'N/A' }}<br>
                {{ $payment->customer->phone ?? $payment->customer->mobile ?? 'N/A' }}
            </div>
        </div>
    @endif

    @if($payment->branch)
        <div class="pdf-section">
            <div class="section-title">Branch Information</div>
            <div class="section-card">
                <strong>{{ $payment->branch->branch_name }}</strong><br>
                {{ $payment->branch->address ?? '' }}<br>
                {{ $payment->branch->city ?? '' }} {{ $payment->branch->state ?? '' }}
            </div>
        </div>
    @endif

    @include('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate])
</body>
</html>

