@php
    $metaItems = collect($meta ?? [])->filter(fn ($value) => !blank($value));
@endphp

<div class="pdf-header">
    <div class="pdf-intro">
        <p class="document-title">{{ strtoupper($title ?? 'Document') }}</p>
        <div class="business-card">
            <h1>{{ $settings['business_name'] ?? 'Photo Studio Management' }}</h1>
            @if(!empty($settings['business_address']))
                <p>{{ $settings['business_address'] }}</p>
            @endif
            <p>
                @if(!empty($settings['business_phone']))
                    Phone: {{ $settings['business_phone'] }}
                @endif
                @if(!empty($settings['business_email']))
                    {{ !empty($settings['business_phone']) ? ' | ' : '' }}Email: {{ $settings['business_email'] }}
                @endif
            </p>
            @if(!empty($settings['business_website']))
                <p>Website: {{ $settings['business_website'] }}</p>
            @endif
            @if(!empty($settings['tax_id']))
                <p>Tax ID: {{ $settings['tax_id'] }}</p>
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

