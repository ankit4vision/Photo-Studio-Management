<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Packages Export</title>
    <?php echo $__env->make('pdfs.partials.styles', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</head>
<body>
    <?php echo $__env->make('pdfs.partials.header', [
        'settings' => $settings,
        'title' => 'Packages Export',
        'meta' => [
            'Exported' => $exportDate,
            'Total Records' => $packages->count(),
        ]
    ], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

    <?php if(!empty($filters)): ?>
        <div class="pdf-section">
            <div class="section-title">Applied Filters</div>
            <div class="section-card">
                <?php $__currentLoopData = $filters; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $value): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php if($value): ?>
                        <strong><?php echo e(ucfirst(str_replace('_', ' ', $key))); ?>:</strong> <?php echo e($value); ?><br>
                    <?php endif; ?>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
        </div>
    <?php endif; ?>

    <div class="pdf-section">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th class="text-right">Price</th>
                    <th>Status</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <?php $__empty_1 = true; $__currentLoopData = $packages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $package): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                    <tr>
                        <td><?php echo e($package->package_name); ?></td>
                        <td><?php echo e($package->package_type); ?></td>
                        <td class="text-right">₹<?php echo e(number_format($package->default_price, 2)); ?></td>
                        <td><?php echo e(ucfirst($package->status)); ?></td>
                        <td><?php echo e($package->description ?? '—'); ?></td>
                    </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                    <tr>
                        <td colspan="5" class="text-center">No packages found</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <?php echo $__env->make('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</body>
</html>

<?php /**PATH E:\management system\Photo-Studio-Management\backend\resources\views/pdfs/packages.blade.php ENDPATH**/ ?>