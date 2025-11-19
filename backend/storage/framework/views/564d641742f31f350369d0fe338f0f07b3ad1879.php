<?php
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
?>

<div class="pdf-header">
    <div class="pdf-intro">
        <p class="document-title"><?php echo e(strtoupper($title ?? 'Document')); ?></p>
        <div class="business-card">
            <h1><?php echo e($displayName); ?></h1>
            <?php if($displayAddress): ?>
                <p><?php echo e($displayAddress); ?></p>
            <?php endif; ?>
            <p>
                <?php if($displayPhone): ?>
                    Phone: <?php echo e($displayPhone); ?>

                <?php endif; ?>
                <?php if($displayEmail): ?>
                    <?php echo e($displayPhone ? ' | ' : ''); ?>Email: <?php echo e($displayEmail); ?>

                <?php endif; ?>
            </p>
            <?php if($displayWebsite): ?>
                <p>Website: <?php echo e($displayWebsite); ?></p>
            <?php endif; ?>
        </div>
    </div>
    <?php if($metaItems->isNotEmpty()): ?>
        <div class="meta-card">
            <table>
                <?php $__currentLoopData = $metaItems; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $label => $value): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr>
                        <td><?php echo e(strtoupper($label)); ?></td>
                        <td><?php echo e($value); ?></td>
                    </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </table>
        </div>
    <?php endif; ?>
</div>

<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/partials/header.blade.php ENDPATH**/ ?>