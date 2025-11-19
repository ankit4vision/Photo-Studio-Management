<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Invoice - <?php echo e($order->order_number); ?></title>
    <?php echo $__env->make('pdfs.partials.styles', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</head>
<body class="invoice-body">
    <?php
        $exportedAt = \Carbon\Carbon::parse($exportDate ?? now());
        $invoicePrefix = trim($settings['invoice_prefix'] ?? '');
        $orderNumber = $order->order_number ?? $order->id;
        $invoiceNumber = $invoicePrefix !== '' ? $invoicePrefix . '-' . $orderNumber : $orderNumber;
        $invoiceDate = optional($order->order_date)->format('d M Y') ?? $exportedAt->format('d M Y');
        $invoiceTime = $exportedAt->format('h:i A');
        $invoiceTitle = strtoupper($settings['invoice_title'] ?? 'Invoice');

        $businessName = $settings['invoice_business_name']
            ?? $settings['business_name']
            ?? 'Photo Studio Management';
        $businessAddress = $settings['invoice_business_address']
            ?? $settings['business_address']
            ?? null;
        $businessPhone = $settings['invoice_contact_phone']
            ?? $settings['business_phone']
            ?? null;
        $businessEmail = $settings['invoice_contact_email']
            ?? $settings['business_email']
            ?? null;
        $businessWebsite = $settings['invoice_business_website']
            ?? $settings['business_website']
            ?? null;

        $customer = $order->customer;
        $customerName = trim(($customer->salutation ?? '') . ' ' . $customer->first_name . ' ' . $customer->last_name);
        $customerCode = $customer->customer_code ?? 'N/A';
        $customerPhone = $customer->phone ?? $customer->mobile ?? 'N/A';
        $customerEmail = $customer->email ?? 'N/A';
        $customerAddress = implode(', ', array_filter([
            $customer->address ?? null,
            $customer->city ?? null,
            $customer->state ?? null,
            $customer->postal_code ?? null,
            $customer->country ?? null,
        ]));
        if(blank($customerAddress)) {
            $customerAddress = '—';
        }

        $branch = $order->branch;
        $branchName = $branch->branch_name ?? 'N/A';
        $branchCode = $branch->branch_code ?? null;
        $branchContact = $branch->contact_number ?? 'N/A';
        $branchAddress = implode(', ', array_filter([
            $branch->address ?? null,
            $branch->city ?? null,
            $branch->state ?? null,
            $branch->postal_code ?? null,
        ]));
        if(blank($branchAddress)) {
            $branchAddress = null;
        }

        $discountAmount = $order->discount ?? $order->flat_discount ?? 0;
    ?>

    <div class="invoice-masthead">
        <div class="masthead-left">
            <p class="masthead-title"><?php echo e($businessName); ?></p>
        </div>
        <div class="masthead-right">
            <?php if($businessAddress): ?>
                <p><?php echo e($businessAddress); ?></p>
            <?php endif; ?>
            <p>Branch: <?php echo e($branchName); ?><?php if($branchCode): ?> (<?php echo e($branchCode); ?>)<?php endif; ?></p>
            <?php if($businessEmail): ?>
                <p>Email: <?php echo e($businessEmail); ?></p>
            <?php endif; ?>
            <?php if($businessPhone): ?>
                <p>Phone: <?php echo e($businessPhone); ?></p>
            <?php endif; ?>
        </div>
    </div>

    <div class="invoice-info-row">
        <div class="info-block">
            <p class="info-label">Invoice</p>
            <p class="info-line">Invoice #: <?php echo e($invoiceNumber); ?></p>
            <p class="info-line">Date & Time: <?php echo e($invoiceDate); ?> • <?php echo e($invoiceTime); ?></p>
            <p class="info-line">Payment Status: <?php echo e(\Illuminate\Support\Str::title($order->payment_status)); ?></p>
        </div>
        <div class="info-block">
            <p class="info-label">Customer</p>
            <p class="info-line">Code: <?php echo e($customerCode); ?></p>
            <p class="info-line">Name: <?php echo e($customerName); ?></p>
            <p class="info-line">Phone: <?php echo e($customerPhone); ?></p>
            <p class="info-line">Address: <?php echo e($customerAddress); ?></p>
        </div>
    </div>

    <div class="line-section">
        <div class="section-title">Products</div>
        <div class="products-grid">
            <div class="products-table">
                <table class="line-items">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th class="text-center">Qty</th>
                            <th class="text-right">Price</th>
                            <th class="text-right">Discount</th>
                            <th class="text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $__currentLoopData = $order->items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <?php $lineDiscount = $item->discount ?? 0; ?>
                            <tr>
                                <td><?php echo e($index + 1); ?></td>
                                <td>
                                    <strong><?php echo e($item->package_name ?? 'N/A'); ?></strong><br>
                                    <span class="muted"><?php echo e($item->package_type ?? 'Package'); ?></span>
                                </td>
                                <td class="text-center"><?php echo e($item->quantity); ?></td>
                                <td class="text-right">₹<?php echo e(number_format($item->unit_price, 2)); ?></td>
                                <td class="text-right">₹<?php echo e(number_format($lineDiscount, 2)); ?></td>
                                <td class="text-right">₹<?php echo e(number_format($item->total_price - $lineDiscount, 2)); ?></td>
                            </tr>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </tbody>
                </table>
                <p class="muted" style="margin-top:6px;">Total Items: <?php echo e($order->items->count()); ?> • Total Qty: <?php echo e($order->items->sum('quantity')); ?></p>
            </div>
            <div class="order-summary">
                <table>
                    <tr>
                        <td>Subtotal</td>
                        <td class="text-right">₹<?php echo e(number_format($order->subtotal, 2)); ?></td>
                    </tr>
                    <tr>
                        <td>Total Discount</td>
                        <td class="text-right">₹<?php echo e(number_format($discountAmount, 2)); ?></td>
                    </tr>
                    <tr>
                        <td>Grand Total</td>
                        <td class="text-right">₹<?php echo e(number_format($order->total_amount, 2)); ?></td>
                    </tr>
                    <tr>
                        <td>Paid</td>
                        <td class="text-right text-success">₹<?php echo e(number_format($order->paid_amount, 2)); ?></td>
                    </tr>
                    <tr>
                        <td>Due</td>
                        <td class="text-right text-danger">₹<?php echo e(number_format($order->remaining_amount, 2)); ?></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <?php if($order->payments && $order->payments->count() > 0): ?>
        <div class="line-section">
            <div class="section-title">Payment Breakdown</div>
            <div class="payment-lines">
                <?php $__currentLoopData = $order->payments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $payment): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <div class="payment-line">
                        #<?php echo e($payment->payment_number); ?> - <?php echo e(optional($payment->payment_date)->format('d M Y') ?? 'N/A'); ?> - <?php echo e(\Illuminate\Support\Str::title(str_replace('_', ' ', $payment->payment_method))); ?> - <?php echo e(\Illuminate\Support\Str::title($payment->payment_type)); ?> - ₹<?php echo e(number_format($payment->amount, 2)); ?>

                    </div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
        </div>
    <?php endif; ?>

    <?php echo $__env->make('pdfs.partials.footer', ['settings' => $settings, 'exportDate' => $exportDate], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</body>
</html>
<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/order.blade.php ENDPATH**/ ?>