<?php
    $metaItems = collect($meta ?? [])->filter(fn ($value) => !blank($value));
?>

<div class="pdf-header">
    <div class="pdf-intro">
        <p class="document-title"><?php echo e(strtoupper($title ?? 'Document')); ?></p>
        <div class="business-card">
            <h1><?php echo e($settings['business_name'] ?? 'Photo Studio Management'); ?></h1>
            <?php if(!empty($settings['business_address'])): ?>
                <p><?php echo e($settings['business_address']); ?></p>
            <?php endif; ?>
            <p>
                <?php if(!empty($settings['business_phone'])): ?>
                    Phone: <?php echo e($settings['business_phone']); ?>

                <?php endif; ?>
                <?php if(!empty($settings['business_email'])): ?>
                    <?php echo e(!empty($settings['business_phone']) ? ' | ' : ''); ?>Email: <?php echo e($settings['business_email']); ?>

                <?php endif; ?>
            </p>
            <?php if(!empty($settings['business_website'])): ?>
                <p>Website: <?php echo e($settings['business_website']); ?></p>
            <?php endif; ?>
            <?php if(!empty($settings['tax_id'])): ?>
                <p>Tax ID: <?php echo e($settings['tax_id']); ?></p>
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

<?php /**PATH E:\management system\Photo-Studio-Management\backend\resources\views/pdfs/partials/header.blade.php ENDPATH**/ ?>