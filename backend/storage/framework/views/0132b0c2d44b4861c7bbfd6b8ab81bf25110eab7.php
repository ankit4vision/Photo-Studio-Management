<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Transaction Receipt - <?php echo e($payment->payment_number); ?></title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.6;
        }
        .header {
            border-bottom: 3px solid #8b5cf6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .company-info h1 {
            color: #8b5cf6;
            font-size: 24px;
            margin-bottom: 5px;
        }
        .company-info p {
            color: #666;
            font-size: 11px;
            margin: 2px 0;
        }
        .receipt-info {
            text-align: right;
        }
        .receipt-info h2 {
            color: #8b5cf6;
            font-size: 28px;
            margin-bottom: 10px;
        }
        .receipt-info p {
            margin: 3px 0;
            font-size: 11px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            background: #8b5cf6;
            color: white;
            padding: 8px 15px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 15px;
        }
        .info-row {
            display: table-row;
        }
        .info-label {
            display: table-cell;
            font-weight: bold;
            width: 30%;
            padding: 8px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
        }
        .info-value {
            display: table-cell;
            padding: 8px;
            border: 1px solid #dee2e6;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .amount-box {
            background: #f8f9fa;
            border: 3px solid #8b5cf6;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
            border-radius: 5px;
        }
        .amount-box .label {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }
        .amount-box .amount {
            font-size: 36px;
            color: #8b5cf6;
            font-weight: bold;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .badge-credit {
            background: #28a745;
            color: white;
        }
        .badge-debit {
            background: #dc3545;
            color: white;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-top">
            <div class="company-info">
                <h1><?php echo e($settings['business_name'] ?? 'Photo Studio Management'); ?></h1>
                <p><?php echo e($settings['business_address'] ?? ''); ?></p>
                <p>Phone: <?php echo e($settings['business_phone'] ?? ''); ?> | Email: <?php echo e($settings['business_email'] ?? ''); ?></p>
            </div>
            <div class="receipt-info">
                <h2>RECEIPT</h2>
                <p><strong>Payment Number:</strong> <?php echo e($payment->payment_number); ?></p>
                <p><strong>Payment Date:</strong> <?php echo e($payment->payment_date->format('Y-m-d')); ?></p>
                <p><strong>Type:</strong> <span class="badge badge-<?php echo e($payment->payment_type); ?>"><?php echo e(strtoupper($payment->payment_type)); ?></span></p>
            </div>
        </div>
    </div>

    <div class="amount-box">
        <div class="label">Payment Amount</div>
        <div class="amount">₹<?php echo e(number_format($payment->amount, 2)); ?></div>
    </div>

    <div class="section">
        <div class="section-title">Transaction Details</div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Payment Number</div>
                <div class="info-value"><?php echo e($payment->payment_number); ?></div>
            </div>
            <div class="info-row">
                <div class="info-label">Payment Date</div>
                <div class="info-value"><?php echo e($payment->payment_date->format('Y-m-d')); ?></div>
            </div>
            <div class="info-row">
                <div class="info-label">Payment Type</div>
                <div class="info-value">
                    <span class="badge badge-<?php echo e($payment->payment_type); ?>"><?php echo e(strtoupper($payment->payment_type)); ?></span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-label">Payment Method</div>
                <div class="info-value"><?php echo e(ucfirst(str_replace('_', ' ', $payment->payment_method))); ?></div>
            </div>
            <div class="info-row">
                <div class="info-label">Amount</div>
                <div class="info-value"><strong>₹<?php echo e(number_format($payment->amount, 2)); ?></strong></div>
            </div>
            <?php if($payment->remarks): ?>
            <div class="info-row">
                <div class="info-label">Remarks</div>
                <div class="info-value"><?php echo e($payment->remarks); ?></div>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <?php if($payment->order): ?>
    <div class="section">
        <div class="section-title">Order Information</div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Order Number</div>
                <div class="info-value"><?php echo e($payment->order->order_number); ?></div>
            </div>
            <div class="info-row">
                <div class="info-label">Order Date</div>
                <div class="info-value"><?php echo e($payment->order->order_date->format('Y-m-d')); ?></div>
            </div>
            <div class="info-row">
                <div class="info-label">Order Total</div>
                <div class="info-value">₹<?php echo e(number_format($payment->order->total_amount, 2)); ?></div>
            </div>
            <div class="info-row">
                <div class="info-label">Order Status</div>
                <div class="info-value"><?php echo e(ucfirst($payment->order->status)); ?></div>
            </div>
            <div class="info-row">
                <div class="info-label">Payment Status</div>
                <div class="info-value"><?php echo e(ucfirst($payment->order->payment_status)); ?></div>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <?php if($payment->customer): ?>
    <div class="section">
        <div class="section-title">Customer Information</div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Customer Code</div>
                <div class="info-value"><?php echo e($payment->customer->customer_code); ?></div>
            </div>
            <div class="info-row">
                <div class="info-label">Name</div>
                <div class="info-value"><?php echo e($payment->customer->first_name); ?> <?php echo e($payment->customer->last_name); ?></div>
            </div>
            <div class="info-row">
                <div class="info-label">Email</div>
                <div class="info-value"><?php echo e($payment->customer->email ?? 'N/A'); ?></div>
            </div>
            <div class="info-row">
                <div class="info-label">Phone</div>
                <div class="info-value"><?php echo e($payment->customer->phone ?? $payment->customer->mobile ?? 'N/A'); ?></div>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <?php if($payment->branch): ?>
    <div class="section">
        <div class="section-title">Branch Information</div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Branch Name</div>
                <div class="info-value"><?php echo e($payment->branch->branch_name); ?></div>
            </div>
            <div class="info-row">
                <div class="info-label">Address</div>
                <div class="info-value"><?php echo e($payment->branch->address ?? 'N/A'); ?></div>
            </div>
            <div class="info-row">
                <div class="info-label">City</div>
                <div class="info-value"><?php echo e($payment->branch->city ?? 'N/A'); ?></div>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <div class="footer">
        <p>Generated on <?php echo e($exportDate); ?> | <?php echo e($settings['business_name'] ?? 'Photo Studio Management'); ?></p>
        <p>This is a computer-generated receipt.</p>
    </div>
</body>
</html>

<?php /**PATH E:\management system\Photo-Studio-Management\backend\resources\views/pdfs/transaction.blade.php ENDPATH**/ ?>