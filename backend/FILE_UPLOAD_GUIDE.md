# File Upload Service - Module-Based Structure Guide

## Overview

The `FileUploadService` now supports module-based folder organization for better file management. Files are organized by module and folder type, making it easier to manage and locate files across different parts of the application.

## Folder Structure

### Local Storage Structure
```
public/uploads/
├── users/
│   └── avatars/
│       └── user_1_1234567890.jpg
├── settings/
│   └── logos/
│       └── business_logo_1234567890.webp
├── customers/
│   └── photos/
│       └── customer_5_1234567890.jpg
├── orders/
│   └── photos/
│       └── order_10_1234567890.jpg
├── packages/
│   └── images/
│       └── package_3_1234567890.jpg
├── branches/
│   └── images/
│       └── branch_2_1234567890.jpg
└── payments/
    └── receipts/
        └── payment_15_1234567890.pdf
```

### S3 Structure
Same structure is maintained in S3:
```
s3://bucket-name/
├── users/avatars/...
├── settings/logos/...
├── customers/photos/...
├── orders/photos/...
├── packages/images/...
├── branches/images/...
└── payments/receipts/...
```

## Usage Examples

### 1. User Avatar Upload
```php
use App\Services\FileUploadService;

// In UserController
$uploadResult = $this->fileUploadService->uploadFile(
    $base64Image,           // File (base64 or UploadedFile)
    'avatars',              // Folder
    'user_1_1234567890.jpg', // Optional custom filename
    'public',               // Visibility (public/private)
    'users'                 // Module name
);

// Result:
// [
//     'path' => 's3://users/avatars/user_1_1234567890.jpg' or '/uploads/users/avatars/user_1_1234567890.jpg',
//     'url' => 'https://...' or 'https://admin.lvclicks.in/uploads/users/avatars/...',
//     'stored_in_s3' => true/false,
//     'module' => 'users',
//     'folder' => 'avatars'
// ]
```

### 2. Business Logo Upload
```php
// In SettingController
$uploadResult = $this->fileUploadService->uploadFile(
    $uploadedFile,
    'logos',
    'business_logo_1234567890.webp',
    'public',
    'settings'
);
```

### 3. Customer Photo Upload
```php
// In CustomerController
$uploadResult = $this->fileUploadService->uploadFile(
    $uploadedFile,
    'photos',
    'customer_' . $customerId . '_' . time() . '.jpg',
    'public',
    'customers'
);
```

### 4. Order Photos Upload
```php
// In OrderController
$uploadResult = $this->fileUploadService->uploadFile(
    $uploadedFile,
    'photos',
    'order_' . $orderId . '_' . time() . '.jpg',
    'public',
    'orders'
);
```

### 5. Package Images Upload
```php
// In PackageController
$uploadResult = $this->fileUploadService->uploadFile(
    $uploadedFile,
    'images',
    'package_' . $packageId . '_' . time() . '.jpg',
    'public',
    'packages'
);
```

### 6. Branch Images Upload
```php
// In BranchController
$uploadResult = $this->fileUploadService->uploadFile(
    $uploadedFile,
    'images',
    'branch_' . $branchId . '_' . time() . '.jpg',
    'public',
    'branches'
);
```

### 7. Payment Receipts Upload
```php
// In PaymentController
$uploadResult = $this->fileUploadService->uploadFile(
    $uploadedFile,
    'receipts',
    'payment_' . $paymentId . '_' . time() . '.pdf',
    'private',  // Receipts might be private
    'payments'
);
```

## Available Modules

| Module | Common Folders | Description |
|--------|---------------|-------------|
| `users` | `avatars` | User profile pictures |
| `settings` | `logos` | Business logos, app settings images |
| `customers` | `photos`, `documents` | Customer photos, ID documents |
| `orders` | `photos`, `proofs` | Order photos, proof images |
| `packages` | `images`, `thumbnails` | Package images, thumbnails |
| `branches` | `images`, `photos` | Branch photos, location images |
| `payments` | `receipts`, `invoices` | Payment receipts, invoice PDFs |

## File Retrieval

### Get File URL
```php
// Convert stored path to full URL
$url = $this->fileUploadService->getFileUrl($storedPath);

// Handles:
// - S3 paths: s3://module/folder/file.jpg → S3 public URL
// - Local paths: /uploads/module/folder/file.jpg → Full local URL
// - Already full URLs: Returns as-is
```

### Delete File
```php
// Delete file (handles both S3 and local)
$deleted = $this->fileUploadService->deleteFile($storedPath);

// Handles:
// - S3 paths: Deletes from S3
// - Local paths: Deletes from local storage
// - Full URLs: Extracts path and deletes
```

## Best Practices

1. **Always specify module**: Always provide the module name for better organization
2. **Use descriptive folders**: Use clear folder names (`photos`, `images`, `documents`, etc.)
3. **Generate unique filenames**: Include IDs and timestamps to avoid conflicts
4. **Handle errors**: Always check `stored_in_s3` and handle fallback scenarios
5. **Store relative paths**: Store the `path` from the result in your database, not the full URL
6. **Use getFileUrl()**: Always use `getFileUrl()` when displaying files to users

## Migration Notes

### Existing Files
- Old files without module structure will continue to work
- The service handles backward compatibility for old paths
- New uploads will use the module-based structure

### Database Storage
- Store the `path` value from upload result
- Use `getFileUrl()` when retrieving for display
- Paths will be in format: `s3://module/folder/file.jpg` or `/uploads/module/folder/file.jpg`

## Example: Complete Upload Flow

```php
// 1. Upload file
$uploadResult = $this->fileUploadService->uploadFile(
    $request->file('photo'),
    'photos',
    'customer_' . $customer->id . '_' . time() . '.jpg',
    'public',
    'customers'
);

// 2. Store path in database
$customer->photo_path = $uploadResult['path'];
$customer->save();

// 3. Retrieve for display
$photoUrl = $this->fileUploadService->getFileUrl($customer->photo_path);

// 4. Delete when needed
if ($customer->photo_path) {
    $this->fileUploadService->deleteFile($customer->photo_path);
}
```

