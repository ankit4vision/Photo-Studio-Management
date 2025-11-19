<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Customer Report - <?php echo e($customer->customer_code); ?></title>
    <style>
        body {
            font-family: "Helvetica Neue", Arial, "DejaVu Sans", sans-serif;
            margin: 18px;
            font-size: 12px;
            color: #222;
            line-height: 1.5;
            background: #fff;
        }
        @page { size: A4; margin: 12mm; }
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .top-bar .left {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .divider {
            border: 0;
            border-top: 1.5px solid #ccc;
            margin: 0 0 12px 0;
        }
        .header-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-bottom: 16px;
        }
        .header-table td {
            vertical-align: top;
            padding: 0 8px 0 0;
        }
        .doc-title {
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .doc-meta div {
            font-size: 11px;
            margin-top: 4px;
        }
        .customer-name {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
        }
        .customer-meta {
            font-size: 11px;
            color: #555;
            margin-bottom: 4px;
        }
        .section-title {
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin-bottom: 4px;
        }
        .section-subtitle {
            font-size: 11px;
            color: #777;
            margin-bottom: 10px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }
        .info-table th,
        .info-table td {
            padding: 6px 8px;
            border-bottom: 1px solid #eee;
            text-align: left;
            font-size: 11px;
        }
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
        .summary-card {
            border: 1px solid #eee;
            border-radius: 6px;
            padding: 10px;
            text-align: center;
        }
        .summary-label {
            display: block;
            font-size: 11px;
            color: #666;
            margin-bottom: 4px;
        }
        .summary-value {
            display: block;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 2px;
            color: #1a1a1a;
        }
        .summary-foot {
            font-size: 10px;
            text-transform: uppercase;
            color: #999;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }
        .data-table th,
        .data-table td {
            border: 1px solid #eee;
            padding: 6px 8px;
            font-size: 11px;
        }
        .data-table th {
            background: #f7f7f7;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            font-weight: 600;
        }
        .data-table .text-right {
            text-align: right;
        }
        .page-break {
            page-break-before: always;
            margin: 0;
            border: none;
        }
        .footer {
            margin-top: 24px;
            padding-top: 12px;
            text-align: center;
            font-size: 11px;
            color: #333;
            line-height: 1.6;
        }
        .footer div { margin-bottom: 3px; }
        .footer .footer-name {
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 6px;
        }
        .footer .footer-contact { margin: 4px 0; }
        .footer .footer-text { margin-top: 8px; font-style: italic; }
    </style>
</head>
<body>
    <?php
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

        $exportStamp = \Carbon\Carbon::parse($exportDate ?? now())->format('d M Y, h:i A');
        $customerName = trim(($customer->first_name ?? '') . ' ' . ($customer->last_name ?? '')) ?: 'N/A';
        $customerCode = $customer->customer_code ?? 'N/A';
        $customerStatus = strtoupper($customer->status ?? 'N/A');
        $customerEmail = $customer->email ?? '—';
        $customerPhone = $customer->phone ?? $customer->mobile ?? '—';
        $customerAddress = implode(', ', array_filter([
            $customer->address ?? null,
            $customer->city ?? null,
            $customer->state ?? null,
            $customer->postal_code ?? null,
            $customer->country ?? null,
        ])) ?: '—';

        $infoRows = [
            'Customer Name' => $customerName,
            'Customer Code' => $customerCode,
            'Email' => $customerEmail,
            'Phone' => $customerPhone,
            'Branch' => $customer->branch->branch_name ?? 'N/A',
            'Address' => $customerAddress,
            'Status' => $customerStatus,
            'DOB' => optional($customer->dob)->format('d M Y') ?? '—',
            'Anniversary' => optional($customer->anniversary_date)->format('d M Y') ?? '—',
        ];
    ?>

    <div class="top-bar">
        <div class="left"><?php echo e($businessName); ?></div>
    </div>
    <hr class="divider">

    <table class="header-table">
        <tr>
            <td class="company-cell">
                <div class="doc-title">Customer Report</div>
                <div class="doc-meta">
                    <div><strong>Customer #:</strong> <?php echo e($customerCode); ?></div>
                    <div><strong>Status:</strong> <?php echo e($customerStatus); ?></div>
                    <div><strong>Exported:</strong> <?php echo e($exportStamp); ?></div>
                </div>
            </td>
            <td class="info-cell">
                <div class="customer-name"><?php echo e($customerName); ?></div>
                <div class="customer-meta">Code: <?php echo e($customerCode); ?></div>
                <div class="customer-meta">Email: <?php echo e($customerEmail); ?></div>
                <div class="customer-meta">Phone: <?php echo e($customerPhone); ?></div>
                <div class="customer-meta">Address: <?php echo e($customerAddress); ?></div>
            </td>
        </tr>
    </table>

    <div class="section-title">Customer Information</div>
    <div class="section-subtitle">Profile & contact overview</div>
    <table class="info-table">
        <?php $__currentLoopData = $infoRows; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $label => $value): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr>
                <th><?php echo e($label); ?></th>
                <td><?php echo e($value ?: '—'); ?></td>
            </tr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </table>

    <div class="section-title">Financial Snapshot</div>
    <div class="section-subtitle">Live totals pulled from orders & payments</div>
    <div class="summary-cards">
        <div class="summary-card">
            <span class="summary-label">Total Orders</span>
            <span class="summary-value"><?php echo e($customer->total_orders ?? 0); ?></span>
            <span class="summary-foot">Confirmed jobs</span>
        </div>
        <div class="summary-card">
            <span class="summary-label">Total Amount</span>
            <span class="summary-value">₹<?php echo e(number_format($customer->total_amount ?? 0, 2)); ?></span>
            <span class="summary-foot">Gross billing</span>
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

    <hr class="page-break">

    <?php if($orders && $orders->count() > 0): ?>
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
                        <td><?php echo e(optional($order->order_date)->format('d M Y') ?? '—'); ?></td>
                        <td><?php echo e($order->items->count()); ?> item(s)</td>
                        <td class="text-right">₹<?php echo e(number_format($order->total_amount, 2)); ?></td>
                        <td class="text-right">₹<?php echo e(number_format($order->paid_amount, 2)); ?></td>
                        <td class="text-right">₹<?php echo e(number_format($order->remaining_amount, 2)); ?></td>
                        <td><?php echo e(ucfirst($order->status ?? 'n/a')); ?></td>
                        <td><?php echo e(ucfirst($order->payment_status ?? 'n/a')); ?></td>
                    </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </tbody>
        </table>
    <?php endif; ?>

    <?php if($payments && $payments->count() > 0): ?>
        <div class="section-title" style="margin-top: 16px;">Payment History (<?php echo e($payments->count()); ?>)</div>
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
                        <td><?php echo e(optional($payment->payment_date)->format('d M Y') ?? '—'); ?></td>
                        <td><?php echo e($payment->order->order_number ?? 'N/A'); ?></td>
                        <td><?php echo e(ucfirst($payment->payment_type)); ?></td>
                        <td><?php echo e(ucfirst(str_replace('_', ' ', $payment->payment_method))); ?></td>
                        <td class="text-right">₹<?php echo e(number_format($payment->amount, 2)); ?></td>
                        <td><?php echo e($payment->remarks ?? '—'); ?></td>
                    </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </tbody>
        </table>
    <?php endif; ?>

    <div class="footer">
        <div class="footer-name"><?php echo e($businessName); ?></div>
        <?php if($businessAddress): ?>
            <div><?php echo e($businessAddress); ?></div>
        <?php endif; ?>
        <?php if($customer->branch && $customer->branch->branch_name): ?>
            <div>Branch: <?php echo e($customer->branch->branch_name); ?></div>
        <?php endif; ?>
        <div class="footer-contact">
            <?php if($businessEmail && $businessPhone): ?>
                <?php echo e($businessEmail); ?> • <?php echo e($businessPhone); ?>

            <?php elseif($businessEmail): ?>
                <?php echo e($businessEmail); ?>

            <?php elseif($businessPhone): ?>
                <?php echo e($businessPhone); ?>

            <?php endif; ?>
        </div>
        <?php if($businessWebsite): ?>
            <div><?php echo e($businessWebsite); ?></div>
        <?php endif; ?>
        <div class="footer-text"><?php echo e($footerText); ?></div>
    </div>
</body>
</html>

<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/customer.blade.php ENDPATH**/ ?>