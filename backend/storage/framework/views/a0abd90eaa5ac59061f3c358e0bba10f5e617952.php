<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>INV-<?php echo e($order->order_number ?? $order->id); ?>_<?php echo e($settings['invoice_business_name'] ?? $settings['business_name'] ?? 'Invoice'); ?></title>
    <?php echo $__env->make('pdfs.partials.styles', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</head>
<body>
    <?php
        $exportedAt = \Carbon\Carbon::parse($exportDate ?? now());
        $invoicePrefix = trim($settings['invoice_prefix'] ?? 'INV');
        $orderNumber = $order->order_number ?? $order->id;
        $invoiceNumber = $invoicePrefix !== '' ? $invoicePrefix . '-' . $orderNumber : $orderNumber;
        $invoiceDate = optional($order->order_date)->format('d M Y') ?? $exportedAt->format('d M Y');
        $invoiceTime = $exportedAt->format('h:i A');

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
        $customerName = trim(($customer->first_name ?? '') . ' ' . ($customer->last_name ?? ''));
        $customerCode = $customer->customer_code ?? 'N/A';
        $customerPhone = $customer->phone ?? $customer->mobile ?? 'N/A';
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

        $discountAmount = $order->discount ?? $order->flat_discount ?? 0;
        $subtotal = $order->subtotal ?? 0;
        $totalAmount = $order->total_amount ?? 0;
        $paidAmount = $order->paid_amount ?? 0;
        $remainingAmount = $order->remaining_amount ?? 0;
    ?>

    <div class="page">

        <!-- HEADER -->
        <div class="header">
            <div class="biz"><?php echo e($businessName); ?></div>
            <div class="biz-sub">
                <?php if($businessAddress): ?>
                    <?php echo e($businessAddress); ?><br>
                <?php endif; ?>
                Branch: <?php echo e($branchName); ?><?php if($branchCode): ?> (<?php echo e($branchCode); ?>)<?php endif; ?><br>
                <?php if($businessEmail): ?>
                    Email: <?php echo e($businessEmail); ?><br>
                <?php endif; ?>
                <?php if($businessPhone): ?>
                    Phone: <?php echo e($businessPhone); ?>

                <?php endif; ?>
            </div>
        </div>

        <div class="dd-hr"></div>

        <!-- INVOICE BODY -->
        <div class="body-row">
            <div class="left">
                <div class="inv-title">INVOICE</div>
                <div class="meta">
                    <div><strong>Invoice #:</strong> <?php echo e($invoiceNumber); ?></div>
                    <div><strong>Date & Time:</strong> <?php echo e($invoiceDate); ?>, <?php echo e($invoiceTime); ?></div>
                </div>
            </div>
            <div class="right" style="text-align:right;">
                <div style="font-weight:600; font-size:12px;">Customer</div>
                <div class="cust">
                    <div><strong>Code:</strong> <?php echo e($customerCode); ?></div>
                    <div><strong>Name:</strong> <?php echo e($customerName); ?></div>
                    <div><strong>Phone:</strong> <?php echo e($customerPhone); ?></div>
                    <div><strong>Address:</strong> <?php echo e($customerAddress); ?></div>
                </div>
            </div>
        </div>

        <div class="dd-hr"></div>

        <!-- PACKAGES -->
        <div class="section-title">PACKAGES</div>

        <table class="invoice-table">
            <thead>
                <tr>
                    <th style="width:32px;">#</th>
                    <th>PRODUCT</th>
                    <th style="width:40px; text-align:right;">QTY</th>
                    <th style="width:80px; text-align:right;">PRICE</th>
                    <th style="width:80px; text-align:right;">DISCOUNT</th>
                    <th style="width:90px; text-align:right;">SUBTOTAL</th>
                </tr>
            </thead>
            <tbody>
                <?php $__currentLoopData = $order->items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php 
                        $lineDiscount = $item->discount ?? 0;
                        $itemSubtotal = ($item->total_price ?? 0) - $lineDiscount;
                        $productName = $item->package_name ?? 'N/A';
                        if($item->package_type) {
                            $productName .= ' (' . $item->package_type . ')';
                        }
                    ?>
                    <tr>
                        <td><?php echo e($index + 1); ?></td>
                        <td class="product-col"><?php echo e($productName); ?></td>
                        <td class="num"><?php echo e($item->quantity ?? 1); ?></td>
                        <td class="num">₹<?php echo e(number_format($item->unit_price ?? 0, 2)); ?></td>
                        <td class="num">₹<?php echo e(number_format($lineDiscount, 2)); ?></td>
                        <td class="num">₹<?php echo e(number_format($itemSubtotal, 2)); ?></td>
                    </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </tbody>
        </table>

        <!-- ORDER SUMMARY BELOW TABLE -->
        <div class="order-summary-block">
            <div class="line">Subtotal: <strong>₹<?php echo e(number_format($subtotal, 2)); ?></strong></div>
            <div class="line">Total Discount: <strong>₹<?php echo e(number_format($discountAmount, 2)); ?></strong></div>
            <div class="grand line">Grand Total: <strong>₹<?php echo e(number_format($totalAmount, 2)); ?></strong></div>
            <div class="line">Paid: <strong>₹<?php echo e(number_format($paidAmount, 2)); ?></strong></div>
            <div class="line">Due: <strong>₹<?php echo e(number_format($remainingAmount, 2)); ?></strong></div>
        </div>

        <!-- PAYMENT BREAKDOWN -->
        <?php if($order->payments && $order->payments->count() > 0): ?>
            <div class="payments">
                <div class="section-title">PAYMENT BREAKDOWN</div>
                <?php $__currentLoopData = $order->payments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $payment): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php
                        $paymentDate = optional($payment->payment_date)->format('d M Y') ?? 'N/A';
                        $paymentMethod = \Illuminate\Support\Str::title(str_replace('_', ' ', $payment->payment_method ?? 'N/A'));
                        $paymentType = \Illuminate\Support\Str::title($payment->payment_type ?? 'N/A');
                        $paymentAmount = number_format($payment->amount ?? 0, 2);
                    ?>
                    <div>#<?php echo e($payment->payment_number ?? 'N/A'); ?> - <?php echo e($paymentDate); ?> - <?php echo e($paymentMethod); ?> - <?php echo e($paymentType); ?> - ₹<?php echo e($paymentAmount); ?></div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
        <?php endif; ?>

        <div class="dd-hr" style="margin-top:12px;"></div>

        <!-- FOOTER -->
        <div class="footer">
            <?php echo e($businessName); ?><?php if($businessWebsite): ?> • <?php echo e($businessWebsite); ?><?php endif; ?><br>
            <?php if($businessEmail || $businessPhone): ?>
                <?php echo e($businessEmail); ?><?php echo e($businessEmail && $businessPhone ? ' • ' : ''); ?><?php echo e($businessPhone); ?><br>
            <?php endif; ?>
            <div style="margin-top:6px;">Thank you!</div>
        </div>

    </div>
</body>
</html>
<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/order.blade.php ENDPATH**/ ?>