@php
    $footerName = $settings['invoice_business_name']
        ?? $settings['business_name']
        ?? 'Photo Studio Management';
    $footerWebsite = $settings['invoice_business_website']
        ?? $settings['business_website']
        ?? null;
    $footerEmail = $settings['invoice_contact_email']
        ?? $settings['business_email']
        ?? null;
    $footerPhone = $settings['invoice_contact_phone']
        ?? $settings['business_phone']
        ?? null;
    $footerText = $settings['invoice_footer_text']
        ?? 'Thank you for your business.';
@endphp

<div class="pdf-footer">
    <p class="footer-title">{{ $footerName }} @if($footerWebsite) • {{ $footerWebsite }} @endif</p>
    <p>
        @if($footerEmail)
            {{ $footerEmail }}
        @endif
        @if($footerPhone)
            {{ $footerEmail ? ' • ' : '' }}{{ $footerPhone }}
        @endif
    </p>
    <p>{{ $footerText }}</p>
    <p>Generated on {{ $exportDate ?? now()->format('Y-m-d H:i:s') }}</p>
</div>

