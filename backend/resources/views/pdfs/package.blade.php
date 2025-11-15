<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Package - {{ $package->package_name }}</title>
    @include('pdfs.partials.styles')
</head>
<body>
    @include('pdfs.partials.header', [
        'settings' => $settings,
        'title' => 'Package Overview',
        'meta' => [
            'Package' => $package->package_name,
            'Type' => $package->package_type,
            'Status' => ucfirst($package->status),
        ]
    ])

    <div class="pdf-section">
        <div class="section-heading">
            <div class="section-title">Package Details</div>
            <div class="section-subtitle">Baseline configuration</div>
        </div>
        <table class="info-table">
            <tr>
                <th>Name</th>
                <td>{{ $package->package_name }}</td>
                <th>Type</th>
                <td>{{ $package->package_type }}</td>
            </tr>
            <tr>
                <th>Status</th>
                <td>{{ ucfirst($package->status) }}</td>
                <th>Default Price</th>
                <td>₹{{ number_format($package->default_price, 2) }}</td>
            </tr>
            <tr>
                <th>Created On</th>
                <td>{{ optional($package->created_at)->format('Y-m-d') }}</td>
                <th>Last Updated</th>
                <td>{{ optional($package->updated_at)->format('Y-m-d H:i') }}</td>
            </tr>
        </table>
    </div>

    @if($package->description)
        <div class="pdf-section">
            <div class="section-title">Description</div>
            <div class="section-card">
                {!! nl2br(e($package->description)) !!}
            </div>
        </div>
    @endif

    @include('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate])
</body>
</html>

