<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Transactions Export</title>
    @include('pdfs.partials.styles')
</head>
<body>
    @include('pdfs.partials.header', [
        'settings' => $settings,
        'title' => 'Transactions Export',
        'meta' => [
            'Exported' => $exportDate,
            'Total Records' => $payments->count(),
        ]
    ])

    @php
        $totalRecords = $payments->count();
        $totalCredits = $payments->where('payment_type', 'credit')->sum('amount');
        $totalDebits = $payments->where('payment_type', 'debit')->sum('amount');
        $netCash = $totalCredits - $totalDebits;
    @endphp

    @if(!empty($filters))
        <div class="pdf-section">
            <div class="section-heading">
                <div class="section-title">Active Filters</div>
                <div class="section-subtitle">Parameters applied to this export</div>
            </div>
            <div class="filter-tags">
                @foreach($filters as $key => $value)
                    @if($value)
                        <span class="filter-tag">{{ strtoupper(str_replace('_', ' ', $key)) }}: {{ $value }}</span>
                    @endif
                @endforeach
            </div>
        </div>
    @endif

    <div class="pdf-section">
        <div class="section-heading">
            <div class="section-title">Wallet Summary</div>
            <div class="section-subtitle">Credit vs debit snapshot</div>
        </div>
        <div class="summary-cards">
            <div class="summary-card">
                <span class="summary-label">Transactions</span>
                <span class="summary-value">{{ $totalRecords }}</span>
                <span class="summary-foot">Rows exported</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Credits</span>
                <span class="summary-value">₹{{ number_format($totalCredits, 2) }}</span>
                <span class="summary-foot">Money in</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Debits</span>
                <span class="summary-value">₹{{ number_format($totalDebits, 2) }}</span>
                <span class="summary-foot">Money out</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Net Cash</span>
                <span class="summary-value">₹{{ number_format($netCash, 2) }}</span>
                <span class="summary-foot">Credits - Debits</span>
            </div>
        </div>
    </div>

    <div class="pdf-section">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Payment #</th>
                    <th>Date</th>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Branch</th>
                    <th>Type</th>
                    <th>Method</th>
                    <th class="text-right">Amount</th>
                    <th>Remarks</th>
                </tr>
            </thead>
            <tbody>
                @forelse($payments as $payment)
                    <tr>
                        <td>{{ $payment->payment_number }}</td>
                        <td>{{ optional($payment->payment_date)->format('Y-m-d') }}</td>
                        <td>{{ $payment->order->order_number ?? 'N/A' }}</td>
                        <td>{{ $payment->customer->first_name ?? '' }} {{ $payment->customer->last_name ?? '' }}</td>
                        <td>{{ $payment->branch->branch_name ?? 'N/A' }}</td>
                        <td>{{ ucfirst($payment->payment_type) }}</td>
                        <td>{{ ucfirst(str_replace('_', ' ', $payment->payment_method)) }}</td>
                        <td class="text-right">₹{{ number_format($payment->amount, 2) }}</td>
                        <td>{{ $payment->remarks ?? '—' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="9" class="text-center">No transactions found</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @include('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate])
</body>
</html>

