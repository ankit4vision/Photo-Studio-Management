<div class="pdf-footer">
    <p>
        <?php echo e($settings['business_name'] ?? 'Photo Studio Management'); ?>

        <?php if(!empty($settings['business_website'])): ?>
            • <?php echo e($settings['business_website']); ?>

        <?php endif; ?>
    </p>
    <p>
        <?php if(!empty($settings['business_email'])): ?>
            <?php echo e($settings['business_email']); ?>

        <?php endif; ?>
        <?php if(!empty($settings['business_phone'])): ?>
            <?php echo e(!empty($settings['business_email']) ? ' • ' : ''); ?><?php echo e($settings['business_phone']); ?>

        <?php endif; ?>
    </p>
    <p>Generated on <?php echo e($exportDate ?? now()->format('Y-m-d H:i:s')); ?></p>
</div>

<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/partials/footer.blade.php ENDPATH**/ ?>