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

    <?php
        $totalPackages = $packages->count();
        $activePackages = $packages->where('status', 'active')->count();
        $inactivePackages = $totalPackages - $activePackages;
        $catalogValue = $packages->sum('default_price');
    ?>

    <?php if(!empty($filters)): ?>
        <div class="pdf-section">
            <div class="section-heading">
                <div class="section-title">Active Filters</div>
                <div class="section-subtitle">Parameters applied to this export</div>
            </div>
            <div class="filter-tags">
                <?php $__currentLoopData = $filters; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $value): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php if($value): ?>
                        <span class="filter-tag"><?php echo e(strtoupper(str_replace('_', ' ', $key))); ?>: <?php echo e($value); ?></span>
                    <?php endif; ?>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
        </div>
    <?php endif; ?>

    <div class="pdf-section">
        <div class="section-heading">
            <div class="section-title">Catalog Snapshot</div>
            <div class="section-subtitle">Current state of package inventory</div>
        </div>
        <div class="summary-cards">
            <div class="summary-card">
                <span class="summary-label">Packages</span>
                <span class="summary-value"><?php echo e($totalPackages); ?></span>
                <span class="summary-foot">Total records</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Active</span>
                <span class="summary-value"><?php echo e($activePackages); ?></span>
                <span class="summary-foot">Live offerings</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Inactive</span>
                <span class="summary-value"><?php echo e($inactivePackages); ?></span>
                <span class="summary-foot">On pause</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Catalog Value</span>
                <span class="summary-value">₹<?php echo e(number_format($catalogValue, 2)); ?></span>
                <span class="summary-foot">Sum of default price</span>
            </div>
        </div>
    </div>

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

<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/packages.blade.php ENDPATH**/ ?>