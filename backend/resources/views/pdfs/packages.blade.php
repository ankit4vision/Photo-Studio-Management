<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Packages Export</title>
    @include('pdfs.partials.styles')
</head>
<body>
    @include('pdfs.partials.header', [
        'settings' => $settings,
        'title' => 'Packages Export',
        'meta' => [
            'Exported' => $exportDate,
            'Total Records' => $packages->count(),
        ]
    ])

    @php
        $totalPackages = $packages->count();
        $activePackages = $packages->where('status', 'active')->count();
        $inactivePackages = $totalPackages - $activePackages;
        $catalogValue = $packages->sum('default_price');
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
            <div class="section-title">Catalog Snapshot</div>
            <div class="section-subtitle">Current state of package inventory</div>
        </div>
        <div class="summary-cards">
            <div class="summary-card">
                <span class="summary-label">Packages</span>
                <span class="summary-value">{{ $totalPackages }}</span>
                <span class="summary-foot">Total records</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Active</span>
                <span class="summary-value">{{ $activePackages }}</span>
                <span class="summary-foot">Live offerings</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Inactive</span>
                <span class="summary-value">{{ $inactivePackages }}</span>
                <span class="summary-foot">On pause</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Catalog Value</span>
                <span class="summary-value">₹{{ number_format($catalogValue, 2) }}</span>
                <span class="summary-foot">Sum of default price</span>
            </div>
        </div>
    </div>

    <div class="pdf-section">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th class="text-right">Price</th>
                    <th>Status</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                @forelse($packages as $package)
                    <tr>
                        <td>{{ $package->package_name }}</td>
                        <td>{{ $package->package_type }}</td>
                        <td class="text-right">₹{{ number_format($package->default_price, 2) }}</td>
                        <td>{{ ucfirst($package->status) }}</td>
                        <td>{{ $package->description ?? '—' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-center">No packages found</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    @include('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate])
</body>
</html>

