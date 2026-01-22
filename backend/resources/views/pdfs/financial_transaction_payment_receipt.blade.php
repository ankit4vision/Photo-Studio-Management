<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>PAYMENT RECEIPT #{{ $transaction->transaction_number ?? $transaction->id }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 18px 18px 12px 18px;
            font-size: 12px;
            color: #000;
            line-height: 1.4;
        }
        .top-bar {
            width: 100%;
            margin-bottom: 12px;
        }
        .top-bar table {
            width: 100%;
            border-collapse: collapse;
        }
        .top-bar .left {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 0.5px;
            vertical-align: middle;
        }
        .logo-img {
            max-width: 120px;
            max-height: 80px;
            object-fit: contain;
            vertical-align: middle;
        }
        .top-bar .logo-right {
            text-align: right;
            vertical-align: middle;
        }
        .top-bar .meta-row {
            margin-bottom: 3px;
            line-height: 1.5;
        }
        .company-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
        }
        .company-meta {
            font-size: 12px;
            color: #000;
            margin-bottom: 3px;
            line-height: 1.4;
        }
        .header-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 0;
            margin-bottom: 14px;
        }
        .header-table td {
            vertical-align: top;
            padding: 0 6px 0 0;
        }
        .header-table .company-cell {
            width: 50%;
        }
        .header-table .info-cell {
            width: 50%;
            text-align: right;
        }
        .info-table {
            width: 100%;
            margin-bottom: 6px;
        }
        .info-table td {
            padding: 1px 4px 1px 0;
            font-size: 12px;
        }
        .section-title {
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 8px;
            margin-top: 14px;
            letter-spacing: 0.5px;
            color: #000;
            text-transform: uppercase;
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
        }
        .products-table th {
            background: transparent;
            font-weight: bold;
            font-size: 12px;
            padding: 6px 4px;
            border: 1px solid #000;
        }
        .products-table th.text-center {
            text-align: center;
        }
        .products-table th.text-start {
            text-align: left;
        }
        .products-table th.text-end {
            text-align: right;
        }
        .products-table td {
            border: 1px solid #000;
            padding: 6px 4px;
            font-size: 12px;
        }
        .products-table td.text-center {
            text-align: center;
        }
        .products-table td.text-start {
            text-align: left;
        }
        .products-table td.text-end {
            text-align: right;
        }
        .products-table tr:last-child td {
            border: 1px solid #000;
        }
        .totals-row {
            font-size: 12px;
            margin-bottom: 12px;
            margin-top: 6px;
            padding: 6px 0;
        }
        .totals-row strong {
            font-weight: 600;
        }
        .bottom-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 0;
            margin-top: 14px;
        }
        .bottom-table td {
            vertical-align: top;
            padding: 0 6px 0 0;
        }
        .summary-table {
            width: 100%;
            margin-top: 6px;
            border-spacing: 0;
        }
        .summary-table td {
            padding: 5px 4px;
            font-size: 12px;
        }
        .summary-table .label {
            text-align: right;
            color: #000;
        }
        .summary-table .value {
            text-align: right;
            font-weight: bold;
            color: #000;
        }
        .summary-table .final {
            font-size: 13px;
            border-top: 1px solid #000;
            padding-top: 6px;
            margin-top: 3px;
            color: #000;
        }
        .footer {
            margin-top: 20px;
            padding-top: 12px;
            text-align: center;
            font-size: 11px;
            color: #000;
            letter-spacing: 0.3px;
            line-height: 1.6;
        }
        .footer div {
            margin-bottom: 3px;
        }
        .footer .footer-name {
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        .footer .footer-contact {
            margin: 4px 0;
        }
        .footer .footer-text {
            margin-top: 8px;
            font-style: italic;
        }
    </style>
</head>
<body>
    @php
        $exportedAt = \Carbon\Carbon::parse($exportDate ?? now());
        
        // Receipt Generated date & time
        $receiptGeneratedDate = $exportedAt->format('d M Y');
        $receiptGeneratedTime = $exportedAt->format('h:i A');
        
        // Transaction date
        $transactionDate = optional($transaction->transaction_date)->format('d M Y') ?? 'N/A';
        
        // Transaction created on
        $transactionCreatedOn = optional($transaction->created_at)->format('d M Y, h:i A') ?? 'N/A';

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
        $footerText = $settings['invoice_footer_text']
            ?? 'Thank you for your business!';
        
        // Get logo path and convert to base64 for PDF
        // IMPORTANT: dompdf requires GD extension to process images (even base64)
        // If GD is not available, logo will be skipped completely
        $logoPath = $settings['business_logo'] ?? null;
        $logoBase64 = null;
        
        // Only process logo if GD extension is available
        if (extension_loaded('gd')) {
            // Try to load uploaded business logo first
            if ($logoPath) {
                $fullPath = storage_path('app/public/' . $logoPath);
                if (file_exists($fullPath) && is_readable($fullPath)) {
                    try {
                        $imageData = file_get_contents($fullPath);
                        $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
                        $mimeTypes = [
                            'jpg' => 'image/jpeg',
                            'jpeg' => 'image/jpeg',
                            'png' => 'image/png',
                            'gif' => 'image/gif',
                            'webp' => 'image/webp',
                        ];
                        $mimeType = $mimeTypes[$extension] ?? 'image/png';
                        $logoBase64 = 'data:' . $mimeType . ';base64,' . base64_encode($imageData);
                    } catch (\Exception $e) {
                        \Log::warning('Failed to load business logo for PDF', ['path' => $fullPath, 'error' => $e->getMessage()]);
                    }
                }
            }
            
            // If no business logo, use default logo
            if (!$logoBase64) {
                $defaultLogoPath = public_path('images/logo-transprant.png');
                if (file_exists($defaultLogoPath) && is_readable($defaultLogoPath)) {
                    try {
                        $imageData = file_get_contents($defaultLogoPath);
                        $logoBase64 = 'data:image/png;base64,' . base64_encode($imageData);
                    } catch (\Exception $e) {
                        \Log::warning('Failed to load default logo for PDF', ['path' => $defaultLogoPath, 'error' => $e->getMessage()]);
                    }
                }
            }
        }

        $category = $transaction->category;
        $categoryName = $category->name ?? 'N/A';
        $categoryType = $category->type ?? 'N/A';

        $createdBy = $transaction->createdBy;
        $createdByName = 'N/A';
        if ($createdBy) {
            $firstName = $createdBy->first_name ?? '';
            $lastName = $createdBy->last_name ?? '';
            $createdByName = trim($firstName . ' ' . $lastName) ?: 'N/A';
        }

        // Transaction details
        $transactionNumber = $transaction->transaction_number ?? 'N/A';
        $transactionType = \Illuminate\Support\Str::title($transaction->transaction_type ?? 'N/A');
        $transactionAmount = $transaction->amount ?? 0;
        $transactionDescription = $transaction->description ?? null;
        
        // For payment receipt, show "Received From" or "Paid To" prominently
        $receivedFrom = $transactionDescription ?: $categoryName;
    @endphp

    <!-- Top Bar: Business Name (left) and Logo (right) -->
    <div class="top-bar">
        <table>
            <tr>
                <td class="left" style="width: 60%;">{{ $businessName }}</td>
                <td class="logo-right" style="width: 40%; text-align: right;">
                    @if($logoBase64)
                        <img src="{{ $logoBase64 }}" alt="{{ $businessName }}" class="logo-img" />
                    @endif
                </td>
            </tr>
        </table>
    </div>
    <hr style="border:0;border-top:1px solid #000;margin:0 0 12px 0;">

    <!-- Second Section: Receipt Details -->
    <table class="header-table">
        <tr>
            <td class="company-cell" style="width: 100%;">
                <div class="company-name" style="font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">PAYMENT RECEIPT</div>
                <div class="company-meta" style="margin-top: 4px;">
                    <div><strong>Receipt #:</strong> {{ $transactionNumber }}</div>
                    <div><strong>Receipt Generated:</strong> {{ $receiptGeneratedDate }}, {{ $receiptGeneratedTime }}</div>
                    <div><strong>Transaction Date:</strong> {{ $transactionDate }}</div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Payment Details -->
    <div class="section-title">Payment Information</div>
    <table class="products-table">
        <thead>
            <tr>
                <th class="text-start">Payment Details</th>
                <th class="text-end">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-start">
                    <div><strong>Transaction Number:</strong> {{ $transactionNumber }}</div>
                    <div><strong>Category:</strong> {{ $categoryName }}</div>
                    <div><strong>Transaction Date:</strong> {{ $transactionDate }}</div>
                    @if($transactionDescription)
                        <div style="margin-top: 4px;"><strong>Transaction Details:</strong> {{ $transactionDescription }}</div>
                    @endif
                </td>
                <td class="text-end" style="vertical-align: top;">
                    <div style="font-size: 16px; font-weight: bold; margin-top: 4px;">₹{{ number_format($transactionAmount, 2) }}</div>
                </td>
            </tr>
        </tbody>
    </table>

    <div class="footer" style="margin-top: 20px;">
        <div class="footer-name">{{ $businessName }}</div>
        <div class="footer-contact">
            @php
                $footerParts = [];
                if($businessAddress) {
                    $footerParts[] = $businessAddress;
                }
                if($businessPhone) {
                    $footerParts[] = $businessPhone;
                }
                if($businessWebsite) {
                    $footerParts[] = $businessWebsite;
                }
            @endphp
            {{ implode(' | ', $footerParts) }}
        </div>
        <div class="footer-text">{{ $footerText }}</div>
    </div>
</body>
</html>

