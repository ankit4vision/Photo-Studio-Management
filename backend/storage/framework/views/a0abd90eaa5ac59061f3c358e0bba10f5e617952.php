<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Invoice - <?php echo e($order->order_number); ?></title>
    <?php echo $__env->make('pdfs.partials.styles', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</head>
<body>
    <?php echo $__env->make('pdfs.partials.header', [
        'settings' => $settings,
        'title' => 'Order Invoice',
        'meta' => [
            'Order #' => $order->order_number,
            'Order Date' => optional($order->order_date)->format('Y-m-d'),
            'Due Date' => optional($order->due_date)->format('Y-m-d'),
            'Status' => ucfirst($order->status),
            'Payment Status' => ucfirst($order->payment_status),
        ]
    ], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

    <div class="pdf-section">
        <div class="section-heading">
            <div class="section-title">Order Snapshot</div>
            <div class="section-subtitle">Financial status at export time</div>
        </div>
        <div class="summary-cards">
            <div class="summary-card">
                <span class="summary-label">Order Total</span>
                <span class="summary-value">₹<?php echo e(number_format($order->total_amount, 2)); ?></span>
                <span class="summary-foot">Subtotal ₹<?php echo e(number_format($order->subtotal, 2)); ?></span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Items</span>
                <span class="summary-value"><?php echo e($order->items->count()); ?></span>
                <span class="summary-foot">Packages included</span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Paid</span>
                <span class="summary-value">₹<?php echo e(number_format($order->paid_amount, 2)); ?></span>
                <span class="summary-foot">Status: <?php echo e(strtoupper($order->payment_status)); ?></span>
            </div>
            <div class="summary-card">
                <span class="summary-label">Remaining</span>
                <span class="summary-value">₹<?php echo e(number_format($order->remaining_amount, 2)); ?></span>
                <span class="summary-foot">Due by <?php echo e(optional($order->due_date)->format('Y-m-d') ?? 'N/A'); ?></span>
            </div>
        </div>
    </div>

    <div class="pdf-section">
        <div class="section-heading">
            <div class="section-title">Bill To & Fulfilment</div>
        </div>
        <table class="info-table">
            <tr>
                <th>Customer</th>
                <td><?php echo e($order->customer->first_name); ?> <?php echo e($order->customer->last_name); ?></td>
                <th>Customer Code</th>
                <td><?php echo e($order->customer->customer_code ?? 'N/A'); ?></td>
            </tr>
            <tr>
                <th>Contact</th>
                <td><?php echo e($order->customer->email ?? 'N/A'); ?> • <?php echo e($order->customer->phone ?? $order->customer->mobile ?? 'N/A'); ?></td>
                <th>Address</th>
                <td><?php echo e($order->customer->address ?? '—'); ?>, <?php echo e($order->customer->city ?? ''); ?> <?php echo e($order->customer->state ?? ''); ?> <?php echo e($order->customer->postal_code ?? ''); ?></td>
            </tr>
            <tr>
                <th>Branch</th>
                <td><?php echo e($order->branch->branch_name ?? 'N/A'); ?></td>
                <th>Branch Contact</th>
                <td><?php echo e($order->branch->contact_number ?? 'N/A'); ?></td>
            </tr>
        </table>
    </div>

    <div class="pdf-section">
        <div class="section-title">Order Items</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Package</th>
                    <th>Type</th>
                    <th class="text-center">Qty</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                <?php $__currentLoopData = $order->items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr>
                        <td><?php echo e($index + 1); ?></td>
                        <td><?php echo e($item->package_name ?? 'N/A'); ?></td>
                        <td><?php echo e($item->package_type ?? 'N/A'); ?></td>
                        <td class="text-center"><?php echo e($item->quantity); ?></td>
                        <td class="text-right">₹<?php echo e(number_format($item->unit_price, 2)); ?></td>
                        <td class="text-right">₹<?php echo e(number_format($item->total_price, 2)); ?></td>
                    </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </tbody>
        </table>
    </div>

    <div class="pdf-section">
        <div class="section-title">Order Summary</div>
        <table class="summary-table">
            <tr>
                <td>Subtotal</td>
                <td class="text-right">₹<?php echo e(number_format($order->subtotal, 2)); ?></td>
            </tr>
            <?php if($order->discount > 0): ?>
                <tr>
                    <td>Discount</td>
                    <td class="text-right">-₹<?php echo e(number_format($order->discount, 2)); ?></td>
                </tr>
            <?php endif; ?>
            <tr>
                <td>Paid Amount</td>
                <td class="text-right">₹<?php echo e(number_format($order->paid_amount, 2)); ?></td>
            </tr>
            <tr>
                <td>Remaining Amount</td>
                <td class="text-right">₹<?php echo e(number_format($order->remaining_amount, 2)); ?></td>
            </tr>
            <tr>
                <td>Total</td>
                <td class="text-right">₹<?php echo e(number_format($order->total_amount, 2)); ?></td>
            </tr>
        </table>
    </div>

    <?php if($order->payments && $order->payments->count() > 0): ?>
        <div class="pdf-section">
            <div class="section-title">Payment History</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Payment #</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Method</th>
                        <th class="text-right">Amount</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $__currentLoopData = $order->payments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $payment): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <tr>
                            <td><?php echo e($payment->payment_number); ?></td>
                            <td><?php echo e(optional($payment->payment_date)->format('Y-m-d')); ?></td>
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

    <?php if($order->notes): ?>
        <div class="pdf-section">
            <div class="section-title">Notes</div>
            <div class="section-card"><?php echo e($order->notes); ?></div>
        </div>
    <?php endif; ?>

    <?php echo $__env->make('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</body>
</html>
<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/order.blade.php ENDPATH**/ ?>