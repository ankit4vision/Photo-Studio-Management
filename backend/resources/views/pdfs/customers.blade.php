<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Customers Export</title>
    @include('pdfs.partials.styles')
</head>
<body>
    @include('pdfs.partials.header', [
        'settings' => $settings,
        'title' => 'Customers Export',
        'meta' => [
            'Exported' => $exportDate,
            'Total Records' => $customers->count(),
        ]
    ])

    @php
        $totalCustomers = $customers->count();
        $totalOrders = $customers->sum('total_orders');
        $totalBilling = $customers->sum('total_amount');
        $totalPaid = $customers->sum('paid_amount');
        $totalOutstanding = $customers->sum('remaining_amount');
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
            <div class="section-title">Portfolio Summary</div>
            <div class="section-subtitle">Aggregated metrics from this list</div>
        </div>
        <div class="summary-cards">
            <div class="summary-card">
                <span class="summary-label">Customers</span>
                <span class="summary-value">{{ $totalCustomers }}</span>
                <span class="summary-foot">Unique profiles</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Orders Logged</span>
                <span class="summary-value">{{ $totalOrders }}</span>
                <span class="summary-foot">Linked jobs</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Total Billing</span>
                <span class="summary-value">₹{{ number_format($totalBilling, 2) }}</span>
                <span class="summary-foot">Gross amount</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Collected</span>
                <span class="summary-value">₹{{ number_format($totalPaid, 2) }}</span>
                <span class="summary-foot">Payments received</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Outstanding</span>
                <span class="summary-value">₹{{ number_format($totalOutstanding, 2) }}</span>
                <span class="summary-foot">Balance to chase</span>
            </div>
        </div>
    </div>

    <div class="pdf-section">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Branch</th>
                    <th class="text-center">Orders</th>
                    <th class="text-right">Total</th>
                    <th class="text-right">Paid</th>
                    <th class="text-right">Remaining</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse($customers as $customer)
                    <tr>
                        <td>{{ $customer->customer_code }}</td>
                        <td>{{ $customer->first_name }} {{ $customer->last_name }}</td>
                        <td>{{ $customer->email ?? 'N/A' }}</td>
                        <td>{{ $customer->phone ?? $customer->mobile ?? 'N/A' }}</td>
                        <td>{{ $customer->city ?? 'N/A' }}</td>
                        <td>{{ $customer->branch->branch_name ?? 'N/A' }}</td>
                        <td class="text-center">{{ $customer->total_orders ?? 0 }}</td>
                        <td class="text-right">₹{{ number_format($customer->total_amount ?? 0, 2) }}</td>
                        <td class="text-right">₹{{ number_format($customer->paid_amount ?? 0, 2) }}</td>
                        <td class="text-right">₹{{ number_format($customer->remaining_amount ?? 0, 2) }}</td>
                        <td>{{ ucfirst($customer->status) }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="11" class="text-center">No customers found</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @include('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate])
</body>
</html>

