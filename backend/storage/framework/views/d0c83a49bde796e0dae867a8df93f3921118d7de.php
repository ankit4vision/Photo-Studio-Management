<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Customer Report - <?php echo e($customer->customer_code); ?></title>
    <?php echo $__env->make('pdfs.partials.styles', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</head>
<body>
    <?php echo $__env->make('pdfs.partials.header', [
        'settings' => $settings,
        'title' => 'Customer Report',
        'meta' => [
            'Customer #' => $customer->customer_code,
            'Status' => ucfirst($customer->status),
            'Exported' => $exportDate,
        ]
    ], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

    <?php
        $infoRows = [
            'Customer Name' => trim(($customer->first_name ?? '') . ' ' . ($customer->last_name ?? '')),
            'Customer Code' => $customer->customer_code,
            'Email' => $customer->email ?? 'N/A',
            'Phone' => $customer->phone ?? $customer->mobile ?? 'N/A',
            'Branch' => $customer->branch->branch_name ?? 'N/A',
            'Address' => trim(($customer->address ?? '') . ', ' . ($customer->city ?? '') . ' ' . ($customer->state ?? '') . ' ' . ($customer->postal_code ?? '')),
            'Status' => strtoupper($customer->status ?? 'N/A'),
            'DOB' => optional($customer->dob)->format('Y-m-d') ?? '—',
            'Anniversary' => optional($customer->anniversary_date)->format('Y-m-d') ?? '—',
        ];
    ?>

    <div class="pdf-section">
        <div class="section-heading">
            <div class="section-title">Customer Information</div>
            <div class="section-subtitle">Profile + contact overview</div>
        </div>
        <table class="info-table">
            <?php $__currentLoopData = $infoRows; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $label => $value): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <tr>
                    <th><?php echo e($label); ?></th>
                    <td><?php echo e($value ?: '—'); ?></td>
                </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </table>
    </div>

    <div class="pdf-section" style="page-break-inside: avoid;">
        <div class="section-heading">
            <div class="section-title">Financial Snapshot</div>
            <div class="section-subtitle">Live totals pulled from orders & payments</div>
        </div>
        <div class="summary-cards">
            <div class="summary-card">
                <span class="summary-label">Total Orders</span>
                <span class="summary-value"><?php echo e($customer->total_orders ?? 0); ?></span>
                <span class="summary-foot">Confirmed Jobs</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Total Amount</span>
                <span class="summary-value">₹<?php echo e(number_format($customer->total_amount ?? 0, 2)); ?></span>
                <span class="summary-foot">Gross Billing</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Paid Amount</span>
                <span class="summary-value">₹<?php echo e(number_format($customer->paid_amount ?? 0, 2)); ?></span>
                <span class="summary-foot">Settled</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Remaining</span>
                <span class="summary-value">₹<?php echo e(number_format($customer->remaining_amount ?? 0, 2)); ?></span>
                <span class="summary-foot">Outstanding</span>
            </div>
        </div>
    </div>

    <div class="page-break"></div>

    <?php if($orders && $orders->count() > 0): ?>
        <div class="pdf-section">
            <div class="section-title">Order History (<?php echo e($orders->count()); ?>)</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th class="text-right">Total</th>
                        <th class="text-right">Paid</th>
                        <th class="text-right">Remaining</th>
                        <th>Status</th>
                        <th>Payment</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $__currentLoopData = $orders; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $order): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <tr>
                            <td><?php echo e($order->order_number); ?></td>
                            <td><?php echo e(optional($order->order_date)->format('Y-m-d')); ?></td>
                            <td><?php echo e($order->items->count()); ?> item(s)</td>
                            <td class="text-right">₹<?php echo e(number_format($order->total_amount, 2)); ?></td>
                            <td class="text-right">₹<?php echo e(number_format($order->paid_amount, 2)); ?></td>
                            <td class="text-right">₹<?php echo e(number_format($order->remaining_amount, 2)); ?></td>
                            <td><?php echo e(ucfirst($order->status)); ?></td>
                            <td><?php echo e(ucfirst($order->payment_status)); ?></td>
                        </tr>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>

    <?php if($payments && $payments->count() > 0): ?>
        <div class="pdf-section">
            <div class="section-title">Payment History (<?php echo e($payments->count()); ?>)</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Payment #</th>
                        <th>Date</th>
                        <th>Order #</th>
                        <th>Type</th>
                        <th>Method</th>
                        <th class="text-right">Amount</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $__currentLoopData = $payments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $payment): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <tr>
                            <td><?php echo e($payment->payment_number); ?></td>
                            <td><?php echo e(optional($payment->payment_date)->format('Y-m-d')); ?></td>
                            <td><?php echo e($payment->order->order_number ?? 'N/A'); ?></td>
                            <td><?php echo e(ucfirst($payment->payment_type)); ?></td>
                            <td><?php echo e(ucfirst(str_replace('_', ' ', $payment->payment_method))); ?></td>
                            <td class="text-right">₹<?php echo e(number_format($payment->amount, 2)); ?></td>
                            <td><?php echo e($payment->remarks ?? '—'); ?></td>
                        </tr>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>

    <?php echo $__env->make('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</body>
</html>

<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/customer.blade.php ENDPATH**/ ?>