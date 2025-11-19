<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Transaction Receipt - <?php echo e($payment->payment_number); ?></title>
    <?php echo $__env->make('pdfs.partials.styles', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</head>
<body>
    <?php echo $__env->make('pdfs.partials.header', [
        'settings' => $settings,
        'title' => 'Payment Receipt',
        'meta' => [
            'Payment #' => $payment->payment_number,
            'Date' => optional($payment->payment_date)->format('Y-m-d'),
            'Type' => ucfirst($payment->payment_type),
        ]
    ], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

    <div class="pdf-section">
        <div class="summary-cards">
            <div class="summary-card">
                <span class="summary-label">Amount</span>
                <span class="summary-value">₹<?php echo e(number_format($payment->amount, 2)); ?></span>
                <span class="summary-foot"><?php echo e(ucfirst($payment->payment_type)); ?> via <?php echo e(ucfirst(str_replace('_', ' ', $payment->payment_method))); ?></span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Payment #</span>
                <span class="summary-value"><?php echo e($payment->payment_number); ?></span>
                <span class="summary-foot">Transaction reference</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Payment Date</span>
                <span class="summary-value"><?php echo e(optional($payment->payment_date)->format('Y-m-d') ?? 'N/A'); ?></span>
                <span class="summary-foot">Value date</span>
            </div>
        </div>
    </div>

    <div class="pdf-section">
        <div class="section-heading">
            <div class="section-title">Transaction Details</div>
            <div class="section-subtitle">Audit-ready reference</div>
        </div>
        <table class="info-table">
            <tr>
                <th>Payment Number</th>
                <td><?php echo e($payment->payment_number); ?></td>
            </tr>
            <tr>
                <th>Payment Date</th>
                <td><?php echo e(optional($payment->payment_date)->format('Y-m-d') ?? 'N/A'); ?></td>
            </tr>
            <tr>
                <th>Payment Type</th>
                <td><?php echo e(ucfirst($payment->payment_type)); ?></td>
            </tr>
            <tr>
                <th>Payment Method</th>
                <td><?php echo e(ucfirst(str_replace('_', ' ', $payment->payment_method))); ?></td>
            </tr>
            <?php if($payment->remarks): ?>
                <tr>
                    <th>Remarks</th>
                    <td><?php echo e($payment->remarks); ?></td>
                </tr>
            <?php endif; ?>
        </table>
    </div>

    <?php if($payment->order): ?>
        <div class="pdf-section">
            <div class="section-title">Order Information</div>
            <table class="data-table">
                <tbody>
                    <tr>
                        <th>Order Number</th>
                        <td><?php echo e($payment->order->order_number); ?></td>
                        <th>Order Date</th>
                        <td><?php echo e(optional($payment->order->order_date)->format('Y-m-d')); ?></td>
                    </tr>
                    <tr>
                        <th>Total Amount</th>
                        <td>₹<?php echo e(number_format($payment->order->total_amount, 2)); ?></td>
                        <th>Payment Status</th>
                        <td><?php echo e(ucfirst($payment->order->payment_status)); ?></td>
                    </tr>
                    <tr>
                        <th>Paid Amount</th>
                        <td>₹<?php echo e(number_format($payment->order->paid_amount, 2)); ?></td>
                        <th>Remaining</th>
                        <td>₹<?php echo e(number_format($payment->order->remaining_amount, 2)); ?></td>
                    </tr>
                </tbody>
            </table>
        </div>
    <?php endif; ?>

    <?php if($payment->customer): ?>
        <div class="pdf-section">
            <div class="section-title">Customer Information</div>
            <div class="section-card">
                <strong><?php echo e($payment->customer->first_name); ?> <?php echo e($payment->customer->last_name); ?></strong><br>
                Code: <?php echo e($payment->customer->customer_code); ?><br>
                <?php echo e($payment->customer->email ?? 'N/A'); ?><br>
                <?php echo e($payment->customer->phone ?? $payment->customer->mobile ?? 'N/A'); ?>

            </div>
        </div>
    <?php endif; ?>

    <?php if($payment->branch): ?>
        <div class="pdf-section">
            <div class="section-title">Branch Information</div>
            <div class="section-card">
                <strong><?php echo e($payment->branch->branch_name); ?></strong><br>
                <?php echo e($payment->branch->address ?? ''); ?><br>
                <?php echo e($payment->branch->city ?? ''); ?> <?php echo e($payment->branch->state ?? ''); ?>

            </div>
        </div>
    <?php endif; ?>

    <?php echo $__env->make('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</body>
</html>

<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/transaction.blade.php ENDPATH**/ ?>