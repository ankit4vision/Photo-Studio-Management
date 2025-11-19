@php
    $metaItems = collect($meta ?? [])->filter(fn ($value) => !blank($value));
    $displayName = $settings['invoice_business_name']
        ?? $settings['business_name']
        ?? 'Photo Studio Management';
    $displayAddress = $settings['invoice_business_address']
        ?? $settings['business_address']
        ?? null;
    $displayPhone = $settings['invoice_contact_phone']
        ?? $settings['business_phone']
        ?? null;
    $displayEmail = $settings['invoice_contact_email']
        ?? $settings['business_email']
        ?? null;
    $displayWebsite = $settings['invoice_business_website']
        ?? $settings['business_website']
        ?? null;
@endphp

<div class="pdf-header">
    <div class="pdf-intro">
        <p class="document-title">{{ strtoupper($title ?? 'Document') }}</p>
        <div class="business-card">
            <h1>{{ $displayName }}</h1>
            @if($displayAddress)
                <p>{{ $displayAddress }}</p>
            @endif
            <p>
                @if($displayPhone)
                    Phone: {{ $displayPhone }}
                @endif
                @if($displayEmail)
                    {{ $displayPhone ? ' | ' : '' }}Email: {{ $displayEmail }}
                @endif
            </p>
            @if($displayWebsite)
                <p>Website: {{ $displayWebsite }}</p>
            @endif
        </div>
    </div>
    @if($metaItems->isNotEmpty())
        <div class="meta-card">
            <table>
                @foreach($metaItems as $label => $value)
                    <tr>
                        <td>{{ strtoupper($label) }}</td>
                        <td>{{ $value }}</td>
                    </tr>
                @endforeach
            </table>
        </div>
    @endif
</div>

