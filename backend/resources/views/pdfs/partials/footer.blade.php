<div class="pdf-footer">
    <p>
        {{ $settings['business_name'] ?? 'Photo Studio Management' }}
        @if(!empty($settings['business_website']))
            • {{ $settings['business_website'] }}
        @endif
    </p>
    <p>
        @if(!empty($settings['business_email']))
            {{ $settings['business_email'] }}
        @endif
        @if(!empty($settings['business_phone']))
            {{ !empty($settings['business_email']) ? ' • ' : '' }}{{ $settings['business_phone'] }}
        @endif
    </p>
    <p>Generated on {{ $exportDate ?? now()->format('Y-m-d H:i:s') }}</p>
</div>

