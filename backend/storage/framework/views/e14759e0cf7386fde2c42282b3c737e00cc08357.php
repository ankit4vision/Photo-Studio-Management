<?php
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
?>

<div class="pdf-footer">
    <p class="footer-title"><?php echo e($footerName); ?> <?php if($footerWebsite): ?> • <?php echo e($footerWebsite); ?> <?php endif; ?></p>
    <p>
        <?php if($footerEmail): ?>
            <?php echo e($footerEmail); ?>

        <?php endif; ?>
        <?php if($footerPhone): ?>
            <?php echo e($footerEmail ? ' • ' : ''); ?><?php echo e($footerPhone); ?>

        <?php endif; ?>
    </p>
    <p><?php echo e($footerText); ?></p>
    <p>Generated on <?php echo e($exportDate ?? now()->format('Y-m-d H:i:s')); ?></p>
</div>

<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/partials/footer.blade.php ENDPATH**/ ?>