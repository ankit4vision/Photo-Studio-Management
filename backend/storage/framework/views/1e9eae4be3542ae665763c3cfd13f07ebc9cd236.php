<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Customers Export</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.5;
        }
        .header {
            border-bottom: 3px solid #8b5cf6;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .company-info h1 {
            color: #8b5cf6;
            font-size: 20px;
            margin-bottom: 5px;
        }
        .company-info p {
            color: #666;
            font-size: 10px;
            margin: 2px 0;
        }
        .report-info {
            text-align: right;
        }
        .report-info p {
            margin: 3px 0;
            font-size: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table th {
            background: #8b5cf6;
            color: white;
            padding: 8px;
            text-align: left;
            font-size: 10px;
            font-weight: bold;
        }
        table td {
            padding: 6px;
            border: 1px solid #dee2e6;
            font-size: 10px;
        }
        table tr:nth-child(even) {
            background: #f8f9fa;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .badge {
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        .badge-active {
            background: #28a745;
            color: white;
        }
        .badge-suspended {
            background: #dc3545;
            color: white;
        }
        .badge-pending {
            background: #ffc107;
            color: #333;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            font-size: 9px;
            color: #666;
        }
        .filters {
            margin-bottom: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-left: 3px solid #8b5cf6;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-top">
            <div class="company-info">
                <h1><?php echo e($settings['business_name'] ?? 'Photo Studio Management'); ?></h1>
                <p><?php echo e($settings['business_address'] ?? ''); ?></p>
            </div>
            <div class="report-info">
                <p><strong>Customers Export</strong></p>
                <p>Export Date: <?php echo e($exportDate); ?></p>
                <p>Total Records: <?php echo e($customers->count()); ?></p>
            </div>
        </div>
    </div>

    <?php if(!empty($filters)): ?>
    <div class="filters">
        <strong>Applied Filters:</strong>
        <?php $__currentLoopData = $filters; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $value): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <?php if($value): ?>
                <?php echo e(ucfirst(str_replace('_', ' ', $key))); ?>: <?php echo e($value); ?> |
            <?php endif; ?>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>
    <?php endif; ?>

    <table>
        <thead>
            <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Branch</th>
                <th>Orders</th>
                <th>Total Amount</th>
                <th>Paid</th>
                <th>Remaining</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <?php $__empty_1 = true; $__currentLoopData = $customers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $customer): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
            <tr>
                <td><?php echo e($customer->customer_code); ?></td>
                <td><?php echo e($customer->first_name); ?> <?php echo e($customer->last_name); ?></td>
                <td><?php echo e($customer->email ?? 'N/A'); ?></td>
                <td><?php echo e($customer->phone ?? $customer->mobile ?? 'N/A'); ?></td>
                <td><?php echo e($customer->city ?? 'N/A'); ?></td>
                <td><?php echo e($customer->branch->branch_name ?? 'N/A'); ?></td>
                <td class="text-center"><?php echo e($customer->total_orders ?? 0); ?></td>
                <td class="text-right">₹<?php echo e(number_format($customer->total_amount ?? 0, 2)); ?></td>
                <td class="text-right">₹<?php echo e(number_format($customer->paid_amount ?? 0, 2)); ?></td>
                <td class="text-right">₹<?php echo e(number_format($customer->remaining_amount ?? 0, 2)); ?></td>
                <td class="text-center">
                    <span class="badge badge-<?php echo e($customer->status); ?>"><?php echo e(strtoupper($customer->status)); ?></span>
                </td>
            </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
            <tr>
                <td colspan="11" class="text-center">No customers found</td>
            </tr>
            <?php endif; ?>
        </tbody>
    </table>

    <div class="footer">
        <p>Generated on <?php echo e($exportDate); ?> | <?php echo e($settings['business_name'] ?? 'Photo Studio Management'); ?></p>
    </div>
</body>
</html>

<?php /**PATH E:\management system\Photo-Studio-Management\backend\resources\views/pdfs/customers.blade.php ENDPATH**/ ?>