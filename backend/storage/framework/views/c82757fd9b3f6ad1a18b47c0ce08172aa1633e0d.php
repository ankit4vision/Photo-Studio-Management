<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>INVOICE #<?php echo e($order->order_number ?? $order->id); ?></title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 18px 18px 12px 18px;
            font-size: 12px;
            color: #222;
        }
        .top-bar {
            width: 100%;
            display: table;
            margin-bottom: 10px;
        }
        .top-bar .left {
            display: table-cell;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 1px;
            vertical-align: middle;
            text-transform: uppercase;
        }
        .top-bar .right {
            display: table-cell;
            text-align: right;
            vertical-align: middle;
            font-size: 12px;
        }
        .top-bar .meta-row {
            margin-bottom: 0;
        }
        .company-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 2px;
            letter-spacing: 0.5px;
        }
        .company-meta {
            font-size: 12px;
            color: #555;
            margin-bottom: 1px;
        }
        .header-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 0;
            margin-bottom: 10px;
        }
        .header-table td {
            vertical-align: top;
            padding: 0 4px 0 0;
        }
        .header-table .company-cell {
            width: 50%;
        }
        .header-table .info-cell {
            width: 50%;
            text-align: right;
        }
        .info-table {
            width: 100%;
            margin-bottom: 6px;
        }
        .info-table td {
            padding: 1px 4px 1px 0;
            font-size: 12px;
        }
        .section-title {
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 6px;
            margin-top: 16px;
            letter-spacing: 0.5px;
            color: #2d2d2d;
            text-transform: uppercase;
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 4px;
        }
        .products-table th {
            background: #f2f2f2;
            font-weight: bold;
            font-size: 12px;
            padding: 5px 3px;
            border: 1px solid #e0e0e0;
        }
        .products-table th.text-center {
            text-align: center;
        }
        .products-table th.text-start {
            text-align: left;
        }
        .products-table th.text-end {
            text-align: right;
        }
        .products-table td {
            border: 1px solid #e0e0e0;
            padding: 5px 3px;
            font-size: 12px;
        }
        .products-table td.text-center {
            text-align: center;
        }
        .products-table td.text-start {
            text-align: left;
        }
        .products-table td.text-end {
            text-align: right;
        }
        .products-table tr:last-child td {
            border: 1px solid #e0e0e0;
        }
        .totals-row {
            font-size: 12px;
            margin-bottom: 10px;
            margin-top: 2px;
        }
        .totals-row strong {
            font-weight: 600;
        }
        .bottom-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 0;
            margin-top: 10px;
        }
        .bottom-table td {
            vertical-align: top;
            padding: 0 4px 0 0;
        }
        .payment-list {
            font-size: 12px;
            margin: 0;
            padding-left: 14px;
        }
        .payment-list li {
            margin-bottom: 2px;
        }
        .summary-table {
            width: 100%;
            margin-top: 0;
            border-spacing: 0;
        }
        .summary-table td {
            padding: 4px 3px;
            font-size: 12px;
        }
        .summary-table .label {
            text-align: right;
            color: #555;
        }
        .summary-table .value {
            text-align: right;
            font-weight: bold;
            color: #222;
        }
        .summary-table .final {
            font-size: 13px;
            border-top: 1px solid #333;
            padding-top: 5px;
            color: #1a1a1a;
        }
        .footer {
            margin-top: 24px;
            text-align: center;
            font-size: 12px;
            color: #333;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <?php
        $exportedAt = \Carbon\Carbon::parse($exportDate ?? now());
        $invoicePrefix = trim($settings['invoice_prefix'] ?? 'INV');
        $orderNumber = $order->order_number ?? $order->id;
        $invoiceNumber = $invoiceNumber ?? ($invoicePrefix !== '' ? $invoicePrefix . $orderNumber : $orderNumber);
        
        // Invoice Generated date & time
        $invoiceGeneratedDate = $exportedAt->format('d M Y');
        $invoiceGeneratedTime = $exportedAt->format('h:i A');
        
        // Order date
        $orderDate = optional($order->order_date)->format('d M Y') ?? 'N/A';
        
        // Order created on
        $orderCreatedOn = optional($order->created_at)->format('d M Y, h:i A') ?? 'N/A';
        
        // Order last updated on
        $orderUpdatedOn = optional($order->updated_at)->format('d M Y, h:i A') ?? 'N/A';

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
        $footerText = $settings['invoice_footer_text']
            ?? 'Thank you for your business!';

        $customer = $order->customer;
        $customerName = trim(($customer->first_name ?? '') . ' ' . ($customer->last_name ?? ''));
        $customerCode = $customer->customer_code ?? 'N/A';
        $customerPhone = $customer->phone ?? $customer->mobile ?? 'N/A';
        $customerEmail = $customer->email ?? null;
        $customerAddress = implode(', ', array_filter([
            $customer->address ?? null,
            $customer->city ?? null,
            $customer->state ?? null,
            $customer->postal_code ?? null,
            $customer->country ?? null,
        ]));
        if(blank($customerAddress)) {
            $customerAddress = '-';
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

    <!-- Top Bar: INVOICE (left) and Invoice Meta (right) -->
    <div class="top-bar">
        <div class="left">INVOICE</div>
        <div class="right">
            <div class="meta-row"><strong>Invoice #:</strong> <?php echo e($invoiceNumber); ?></div>
            <div class="meta-row"><strong>Invoice Generated:</strong> <?php echo e($invoiceGeneratedDate); ?>, <?php echo e($invoiceGeneratedTime); ?></div>
            <div class="meta-row"><strong>Order Date:</strong> <?php echo e($orderDate); ?></div>
        </div>
    </div>
    <hr style="border:0;border-top:1.5px solid #bbb;margin:0 0 10px 0;">

    <!-- Header: Business and Customer Info (Table) -->
    <table class="header-table">
        <tr>
            <td class="company-cell">
                <div class="company-name"><?php echo e($businessName); ?></div>
                <?php if($businessAddress): ?>
                    <div class="company-meta"><?php echo e($businessAddress); ?></div>
                <?php endif; ?>
                <?php if($branchName): ?>
                    <div class="company-meta">Branch: <?php echo e($branchName); ?><?php if($branchCode): ?> (<?php echo e($branchCode); ?>)<?php endif; ?></div>
                <?php endif; ?>
                <?php if($businessEmail): ?>
                    <div class="company-meta">Email: <?php echo e($businessEmail); ?></div>
                <?php endif; ?>
                <?php if($businessPhone): ?>
                    <div class="company-meta">Phone: <?php echo e($businessPhone); ?></div>
                <?php endif; ?>
                <?php if($businessWebsite): ?>
                    <div class="company-meta">Website: <?php echo e($businessWebsite); ?></div>
                <?php endif; ?>
            </td>
            <td class="info-cell">
                <div class="company-name"><?php echo e($customerName ?: 'Walk-in'); ?></div>
                <div class="company-meta">Code: <?php echo e($customerCode); ?></div>
                <div class="company-meta">Phone: <?php echo e($customerPhone); ?></div>
                <?php if($customerEmail): ?>
                    <div class="company-meta">Email: <?php echo e($customerEmail); ?></div>
                <?php endif; ?>
                <?php if($customerAddress && $customerAddress !== '-'): ?>
                    <div class="company-meta">Address: <?php echo e($customerAddress); ?></div>
                <?php endif; ?>
                <div class="company-meta" style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #e0e0e0;">
                    <div style="font-size: 10px; color: #777;">Created: <?php echo e($orderCreatedOn); ?></div>
                    <div style="font-size: 10px; color: #777;">Updated: <?php echo e($orderUpdatedOn); ?></div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Packages List -->
    <div class="section-title">Packages</div>
    <table class="products-table">
        <thead>
            <tr>
                <th class="text-center">#</th>
                <th class="text-start">Items</th>
                <th class="text-center">Qty</th>
                <th class="text-end">Price</th>
                <th class="text-end">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            <?php $totalQty = 0; ?>
            <?php $__currentLoopData = $order->items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $idx => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <?php 
                    $totalQty += $item->quantity ?? 1;
                    $lineDiscount = $item->discount ?? 0;
                    $itemSubtotal = ($item->total_price ?? 0) - $lineDiscount;
                    $productName = $item->package_name ?? 'N/A';
                    if($item->package_type) {
                        $productName .= ' (' . $item->package_type . ')';
                    }
                ?>
                <tr>
                    <td class="text-center"><?php echo e($idx + 1); ?></td>
                    <td class="text-start"><?php echo e($productName); ?></td>
                    <td class="text-center"><?php echo e($item->quantity ?? 1); ?></td>
                    <td class="text-end">₹<?php echo e(number_format($item->unit_price ?? 0, 2)); ?></td>
                    <td class="text-end">₹<?php echo e(number_format($itemSubtotal, 2)); ?></td>
                </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tbody>
    </table>
    <div class="totals-row">
        <strong>Total Items:</strong> <?php echo e(count($order->items)); ?> &nbsp; | &nbsp; <strong>Total Qty:</strong> <?php echo e($totalQty); ?>

    </div>

    <!-- Bottom: Two Columns (Table) -->
    <table class="bottom-table">
        <tr>
            <td style="width:50%;vertical-align:top;">
                <div class="section-title">Payment Breakdown</div>
                <?php if($order->payments && $order->payments->count() > 0): ?>
                    <ul class="payment-list">
                        <?php $__currentLoopData = $order->payments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $payment): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <?php
                                $paymentDate = optional($payment->payment_date)->format('d M Y') ?? 'N/A';
                                $paymentMethod = \Illuminate\Support\Str::title(str_replace('_', ' ', $payment->payment_method ?? 'N/A'));
                                $paymentType = \Illuminate\Support\Str::title($payment->payment_type ?? 'N/A');
                                $paymentAmount = number_format($payment->amount ?? 0, 2);
                            ?>
                            <li>
                                <strong><?php echo e(strtoupper($payment->payment_number ?? 'N/A')); ?>:</strong>
                                ₹<?php echo e($paymentAmount); ?>

                                <span style="color:#888;">- <?php echo e($paymentDate); ?> - <?php echo e($paymentMethod); ?> - <?php echo e($paymentType); ?></span>
                            </li>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </ul>
                <?php else: ?>
                    <div style="color:#888;">No payment info available.</div>
                <?php endif; ?>
            </td>
            <td style="width:50%;vertical-align:top;">
                <div class="section-title" style="text-align:right;">SUMMARY</div>
                <table class="summary-table">
                    <tr>
                        <td class="label">Subtotal:</td>
                        <td class="value">₹<?php echo e(number_format($subtotal, 2)); ?></td>
                    </tr>
                    <tr>
                        <td class="label">Flat Discount:</td>
                        <td class="value">₹<?php echo e(number_format($discountAmount, 2)); ?></td>
                    </tr>
                    <tr>
                        <td class="label">Grand Total:</td>
                        <td class="value">₹<?php echo e(number_format($totalAmount, 2)); ?></td>
                    </tr>
                    <tr class="final">
                        <td class="label">Final Payable:</td>
                        <td class="value">₹<?php echo e(number_format($totalAmount, 2)); ?></td>
                    </tr>
                    <tr>
                        <td class="label">Paid:</td>
                        <td class="value">₹<?php echo e(number_format($paidAmount, 2)); ?></td>
                    </tr>
                    <tr>
                        <td class="label">Due:</td>
                        <td class="value">₹<?php echo e(number_format($remainingAmount, 2)); ?></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <div class="footer">
        <?php echo e($footerText); ?>

    </div>
</body>
</html>

<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/order_invoice.blade.php ENDPATH**/ ?>