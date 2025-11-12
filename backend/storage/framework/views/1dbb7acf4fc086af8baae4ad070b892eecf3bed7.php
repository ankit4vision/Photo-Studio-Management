<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo e($subject ?? 'Email'); ?></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 20px;
            border: 1px solid #e5e7eb;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1><?php echo e(config('app.name')); ?></h1>
    </div>
    <div class="content">
        <?php if(isset($message)): ?>
            <p><?php echo e($message); ?></p>
        <?php elseif(isset($body)): ?>
            <?php echo $body; ?>

        <?php else: ?>
            <p>This is an email from <?php echo e(config('app.name')); ?>.</p>
        <?php endif; ?>
    </div>
    <div class="footer">
        <p>&copy; <?php echo e(date('Y')); ?> <?php echo e(config('app.name')); ?>. All rights reserved.</p>
    </div>
</body>
</html>

<?php /**PATH E:\management system\Photo-Studio-Management\backend\resources\views/emails/generic.blade.php ENDPATH**/ ?>