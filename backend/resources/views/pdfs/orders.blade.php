<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Orders Export</title>
    @include('pdfs.partials.styles')
</head>
<body>
    @include('pdfs.partials.header', [
        'settings' => $settings,
        'title' => 'Orders Export',
        'meta' => [
            'Exported' => $exportDate,
            'Total Orders' => $orders->count(),
        ]
    ])

    @php
        $totalOrders = $orders->count();
        $totalAmount = $orders->sum('total_amount');
        $totalPaid = $orders->sum('paid_amount');
        $totalRemaining = $orders->sum('remaining_amount');
    @endphp

    @if(!empty($filters))
        <div class="pdf-section">
            <div class="section-heading">
                <div class="section-title">Active Filters</div>
                <div class="section-subtitle">Context for this export</div>
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
            <div class="section-title">Revenue Summary</div>
            <div class="section-subtitle">Totals calculated from listed orders</div>
        </div>
        <div class="summary-cards">
            <div class="summary-card">
                <span class="summary-label">Orders</span>
                <span class="summary-value">{{ $totalOrders }}</span>
                <span class="summary-foot">Total rows exported</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Gross Value</span>
                <span class="summary-value">₹{{ number_format($totalAmount, 2) }}</span>
                <span class="summary-foot">Total amount</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Collected</span>
                <span class="summary-value">₹{{ number_format($totalPaid, 2) }}</span>
                <span class="summary-foot">Paid so far</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Outstanding</span>
                <span class="summary-value">₹{{ number_format($totalRemaining, 2) }}</span>
                <span class="summary-foot">Balance to chase</span>
            </div>
        </div>
    </div>

    <div class="pdf-section">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Branch</th>
                    <th class="text-center">Items</th>
                    <th class="text-right">Total</th>
                    <th class="text-right">Paid</th>
                    <th class="text-right">Remaining</th>
                    <th>Status</th>
                    <th>Payment</th>
                </tr>
            </thead>
            <tbody>
                @forelse($orders as $order)
                    <tr>
                        <td>{{ $order->order_number }}</td>
                        <td>{{ optional($order->order_date)->format('Y-m-d') }}</td>
                        <td>{{ $order->customer->first_name ?? '' }} {{ $order->customer->last_name ?? '' }}</td>
                        <td>{{ $order->branch->branch_name ?? 'N/A' }}</td>
                        <td class="text-center">{{ $order->items->count() }}</td>
                        <td class="text-right">₹{{ number_format($order->total_amount, 2) }}</td>
                        <td class="text-right">₹{{ number_format($order->paid_amount, 2) }}</td>
                        <td class="text-right">₹{{ number_format($order->remaining_amount, 2) }}</td>
                        <td>{{ ucfirst($order->status) }}</td>
                        <td>{{ ucfirst($order->payment_status) }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="10" class="text-center">No orders found</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @include('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate])
</body>
</html>
