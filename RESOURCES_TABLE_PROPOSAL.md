# Resources Table Design Proposal

## Overview
This document proposes a centralized `resources` table to manage all file uploads (images, documents, etc.) for the Photo Studio Management System. This will replace the current approach of storing file paths directly in entity tables (e.g., `users.avatar`, `customers.avatar`).

---

## Current State Analysis

### Current File Storage Locations
1. **users** table: `avatar` column (varchar)
2. **customers** table: `avatar` column (varchar)
3. **settings** table: Logo stored as setting value
4. **orders**: Potentially photos (not yet implemented)
5. **packages**: Potentially images (not yet implemented)
6. **branches**: Potentially images (not yet implemented)
7. **payments**: Potentially receipts (not yet implemented)

### Current File Path Formats
- **Local Storage**: `/uploads/{module}/{folder}/{filename}`
- **S3 Storage**: `s3://{module}/{folder}/{filename}`

### Current Modules & Folders
- `users/avatars` - User profile pictures
- `customers/photos` - Customer photos
- `settings/logos` - Business logos
- `orders/photos` - Order-related photos
- `packages/images` - Package images
- `branches/images` - Branch images
- `payments/receipts` - Payment receipts

---

## Proposed `resources` Table Schema

### Table Structure

```sql
CREATE TABLE `resources` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- File Information
    `filename` VARCHAR(255) NOT NULL COMMENT 'Original filename',
    `original_filename` VARCHAR(255) NULL COMMENT 'Original filename before upload',
    `file_path` VARCHAR(2048) NOT NULL COMMENT 'Storage path (relative or S3 path)',
    `file_url` VARCHAR(2048) NULL COMMENT 'Full accessible URL (cached)',
    `file_size` BIGINT UNSIGNED NULL COMMENT 'File size in bytes',
    `mime_type` VARCHAR(100) NULL COMMENT 'MIME type (e.g., image/jpeg)',
    `file_extension` VARCHAR(10) NULL COMMENT 'File extension (e.g., jpg, png)',
    
    -- Storage Location
    `location` ENUM('local', 's3') NOT NULL DEFAULT 'local' COMMENT 'Storage location type',
    `storage_disk` VARCHAR(50) NULL COMMENT 'Storage disk name (e.g., uploads, s3)',
    
    -- Organization
    `module` VARCHAR(100) NOT NULL COMMENT 'Module name (e.g., users, customers, orders)',
    `folder` VARCHAR(100) NOT NULL COMMENT 'Folder name (e.g., avatars, photos, logos)',
    `resource_type` VARCHAR(100) NULL COMMENT 'Resource type (e.g., avatar, logo, photo, receipt)',
    
    -- Related Entity (Simple and flexible)
    `related_table` VARCHAR(100) NOT NULL COMMENT 'Related table name (e.g., users, customers, orders, settings)',
    `related_id` BIGINT UNSIGNED NOT NULL COMMENT 'Related record ID',
    
    -- Metadata
    `title` VARCHAR(255) NULL COMMENT 'Optional title/description',
    `description` TEXT NULL COMMENT 'Optional description',
    `alt_text` VARCHAR(255) NULL COMMENT 'Alt text for images (accessibility)',
    `is_primary` BOOLEAN DEFAULT FALSE COMMENT 'Primary resource for entity (e.g., main avatar)',
    `sort_order` INT UNSIGNED DEFAULT 0 COMMENT 'Sort order for multiple resources',
    
    -- Status & Visibility
    `visibility` ENUM('public', 'private') DEFAULT 'public' COMMENT 'File visibility',
    `status` ENUM('active', 'deleted', 'archived') DEFAULT 'active' COMMENT 'Resource status',
    
    -- Audit Trail
    `uploaded_by` BIGINT UNSIGNED NULL COMMENT 'FK to users.id (who uploaded)',
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    `deleted_at` TIMESTAMP NULL COMMENT 'Soft delete',
    
    -- Indexes
    INDEX `idx_related` (`related_table`, `related_id`),
    INDEX `idx_module_folder` (`module`, `folder`),
    INDEX `idx_location` (`location`),
    INDEX `idx_status` (`status`),
    INDEX `idx_uploaded_by` (`uploaded_by`),
    INDEX `idx_created_at` (`created_at`),
    
    -- Foreign Keys
    FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Design Decisions

### 1. **Related Entity Tracking**
**Proposed: Simple Table + ID Approach**
- **`related_table`**: Stores the table name (e.g., 'users', 'customers', 'orders', 'settings')
- **`related_id`**: Stores the record ID in that table
- Simple, flexible, and easy to query
- No need for multiple foreign key columns

**Usage Pattern:**
- For user avatar: `related_table='users'`, `related_id=1`
- For customer photo: `related_table='customers'`, `related_id=5`
- For settings logo: `related_table='settings'`, `related_id=<setting_id>` or use `related_id` to store setting key if needed

### 2. **Location Tracking**
- `location` ENUM: Explicitly tracks 'local' or 's3'
- `storage_disk`: Additional disk identifier
- `file_path`: Stores the actual path (relative or S3 path)
- `file_url`: Cached full URL (can be regenerated if needed)

### 3. **Multiple Files Support**
- `is_primary`: Marks the primary/default resource
- `sort_order`: Allows ordering multiple resources
- `resource_type`: Categorizes resources (avatar, logo, photo, etc.)

### 4. **Soft Deletes**
- `deleted_at`: Soft delete for audit trail
- `status`: Additional status tracking (active, deleted, archived)

---

## Migration Strategy

### Phase 1: Create Resources Table
1. Create `resources` table migration
2. Create `Resource` model with relationships

### Phase 2: Data Migration
1. Migrate existing file paths from:
   - `users.avatar` → `resources` table
   - `customers.avatar` → `resources` table
   - `settings` logo values → `resources` table
2. Update `location` based on path prefix (`s3://` vs `/uploads/`)

### Phase 3: Code Refactoring
1. Update `FileUploadService` to create `Resource` records
2. Update controllers to use `Resource` relationships
3. Update frontend to work with new structure
4. Remove `avatar` columns from `users` and `customers` tables (optional)

### Phase 4: Cleanup
1. Remove old file path columns (if desired)
2. Update all queries to use `resources` table

---

## Example Usage Scenarios

### Scenario 1: User Avatar Upload
```php
// Upload file
$uploadResult = $fileUploadService->uploadFile($file, 'avatars', null, 'public', 'users');

// Create resource record
$resource = Resource::create([
    'filename' => $uploadResult['filename'],
    'file_path' => $uploadResult['path'],
    'file_url' => $uploadResult['url'],
    'location' => $uploadResult['stored_in_s3'] ? 's3' : 'local',
    'module' => 'users',
    'folder' => 'avatars',
    'resource_type' => 'avatar',
    'related_table' => 'users',
    'related_id' => $user->id,
    'is_primary' => true,
    'uploaded_by' => auth()->id(),
]);

// Update user (optional - keep for backward compatibility)
$user->avatar = $resource->file_path;
$user->save();
```

### Scenario 2: Multiple Order Photos
```php
// Upload multiple photos
foreach ($photos as $index => $photo) {
    $uploadResult = $fileUploadService->uploadFile($photo, 'photos', null, 'public', 'orders');
    
    Resource::create([
        'filename' => $uploadResult['filename'],
        'file_path' => $uploadResult['path'],
        'file_url' => $uploadResult['url'],
        'location' => $uploadResult['stored_in_s3'] ? 's3' : 'local',
        'module' => 'orders',
        'folder' => 'photos',
        'resource_type' => 'photo',
        'related_table' => 'orders',
        'related_id' => $order->id,
        'sort_order' => $index,
        'uploaded_by' => auth()->id(),
    ]);
}

// Retrieve order photos
$orderPhotos = Resource::where('related_table', 'orders')
    ->where('related_id', $order->id)
    ->where('module', 'orders')
    ->where('folder', 'photos')
    ->orderBy('sort_order')
    ->get();
```

### Scenario 3: Query Resources by Location
```php
// Get all S3 resources
$s3Resources = Resource::where('location', 's3')->get();

// Get all local resources
$localResources = Resource::where('location', 'local')->get();

// Migrate local to S3
foreach ($localResources as $resource) {
    // Upload to S3
    // Update resource record
    $resource->location = 's3';
    $resource->file_path = $newS3Path;
    $resource->file_url = $newS3Url;
    $resource->save();
}
```

---

## Model Relationships

### Resource Model
```php
class Resource extends Model
{
    protected $fillable = [
        'filename', 'original_filename', 'file_path', 'file_url',
        'file_size', 'mime_type', 'file_extension',
        'location', 'storage_disk',
        'module', 'folder', 'resource_type',
        'related_table', 'related_id',
        'title', 'description', 'alt_text',
        'is_primary', 'sort_order',
        'visibility', 'status',
        'uploaded_by',
    ];

    // Dynamic relationship based on related_table
    public function related()
    {
        $table = $this->related_table;
        $id = $this->related_id;
        
        // Map table names to model classes
        $modelMap = [
            'users' => User::class,
            'customers' => Customer::class,
            'orders' => Order::class,
            'packages' => Package::class,
            'branches' => Branch::class,
            'payments' => Payment::class,
            'settings' => Setting::class,
        ];
        
        if (isset($modelMap[$table])) {
            return $modelMap[$table]::find($id);
        }
        
        return null;
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
    
    // Helper scopes
    public function scopeForTable($query, $table)
    {
        return $query->where('related_table', $table);
    }
    
    public function scopeForRecord($query, $table, $id)
    {
        return $query->where('related_table', $table)->where('related_id', $id);
    }
}
```

### User Model (Updated)
```php
class User extends Model
{
    // Automatically append avatar image object to JSON
    protected $appends = ['avatar_image'];

    // Resources relationship
    public function resources()
    {
        return Resource::where('related_table', 'users')
            ->where('related_id', $this->id);
    }

    // Get avatar resource
    public function avatarResource()
    {
        return Resource::where('related_table', 'users')
            ->where('related_id', $this->id)
            ->where('module', 'users')
            ->where('folder', 'avatars')
            ->where('resource_type', 'avatar')
            ->where('is_primary', true)
            ->first();
    }

    // Accessor: Automatically include avatar as image object
    public function getAvatarImageAttribute()
    {
        $resource = $this->avatarResource();
        
        if (!$resource) {
            return null;
        }

        return [
            'id' => $resource->id,
            'url' => $resource->file_url,
            'path' => $resource->file_path,
            'location' => $resource->location, // 'local' or 's3'
            'filename' => $resource->filename,
            'mime_type' => $resource->mime_type,
            'file_size' => $resource->file_size,
            'is_primary' => $resource->is_primary,
        ];
    }
}
```

### Customer Model (Updated)
```php
class Customer extends Model
{
    protected $appends = ['avatar_image'];

    public function resources()
    {
        return Resource::where('related_table', 'customers')
            ->where('related_id', $this->id);
    }

    public function avatarResource()
    {
        return Resource::where('related_table', 'customers')
            ->where('related_id', $this->id)
            ->where('module', 'customers')
            ->where('folder', 'photos')
            ->where('resource_type', 'avatar')
            ->where('is_primary', true)
            ->first();
    }

    public function getAvatarImageAttribute()
    {
        $resource = $this->avatarResource();
        
        if (!$resource) {
            return null;
        }

        return [
            'id' => $resource->id,
            'url' => $resource->file_url,
            'path' => $resource->file_path,
            'location' => $resource->location,
            'filename' => $resource->filename,
            'mime_type' => $resource->mime_type,
            'file_size' => $resource->file_size,
        ];
    }
}
```

### Settings Model (Updated)
```php
class Setting extends Model
{
    // For logo settings, get the resource
    public function logoResource()
    {
        if ($this->key === 'business_logo' || $this->key === 'logo') {
            return Resource::where('related_table', 'settings')
                ->where('related_id', $this->id)
                ->where('module', 'settings')
                ->where('folder', 'logos')
                ->where('is_primary', true)
                ->first();
        }
        return null;
    }

    // Accessor for logo image
    public function getLogoImageAttribute()
    {
        $resource = $this->logoResource();
        
        if (!$resource) {
            return null;
        }

        return [
            'id' => $resource->id,
            'url' => $resource->file_url,
            'path' => $resource->file_path,
            'location' => $resource->location,
            'filename' => $resource->filename,
        ];
    }
}
```

---

## Benefits of This Approach

1. **Centralized Management**: All files tracked in one place
2. **Location Tracking**: Explicit `location` column makes it easy to query/filter
3. **Simplicity**: Simple `related_table` + `related_id` approach - no complex foreign keys
4. **Flexibility**: Easy to add new tables without schema changes
5. **Multiple Files**: Easy to support multiple files per entity
6. **Audit Trail**: Track who uploaded, when, and file metadata
7. **Migration Support**: Easy to migrate between local and S3
8. **Query Performance**: Indexes on common query patterns
9. **Backward Compatibility**: Can keep old columns during transition
10. **Extensibility**: Easy to add new resource types or modules

---

## API Response Examples

### User API Response (with avatar_image object)
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "avatar_image": {
    "id": 5,
    "url": "https://bucket.s3.region.amazonaws.com/users/avatars/user_1_1234567890.jpg",
    "path": "s3://users/avatars/user_1_1234567890.jpg",
    "location": "s3",
    "filename": "user_1_1234567890.jpg",
    "mime_type": "image/jpeg",
    "file_size": 245678,
    "is_primary": true
  },
  "roles": [...],
  "created_at": "2025-01-15T10:00:00.000000Z"
}
```

### Customer API Response (with avatar_image object)
```json
{
  "id": 10,
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "avatar_image": {
    "id": 12,
    "url": "https://example.com/uploads/customers/photos/customer_10_1234567890.jpg",
    "path": "/uploads/customers/photos/customer_10_1234567890.jpg",
    "location": "local",
    "filename": "customer_10_1234567890.jpg",
    "mime_type": "image/png",
    "file_size": 189234
  },
  "created_at": "2025-01-15T10:00:00.000000Z"
}
```

### Settings API Response (with logo_image object)
```json
{
  "id": 1,
  "key": "business_logo",
  "value": "s3://settings/logos/business_logo_1234567890.webp",
  "group": "general",
  "logo_image": {
    "id": 8,
    "url": "https://bucket.s3.region.amazonaws.com/settings/logos/business_logo_1234567890.webp",
    "path": "s3://settings/logos/business_logo_1234567890.webp",
    "location": "s3",
    "filename": "business_logo_1234567890.webp",
    "mime_type": "image/webp",
    "file_size": 45678
  }
}
```

### Order API Response (with photos array)
```json
{
  "id": 25,
  "order_number": "ORD-001",
  "customer_id": 10,
  "photos": [
    {
      "id": 30,
      "url": "https://bucket.s3.region.amazonaws.com/orders/photos/order_25_1.jpg",
      "path": "s3://orders/photos/order_25_1.jpg",
      "location": "s3",
      "filename": "order_25_1.jpg",
      "mime_type": "image/jpeg",
      "file_size": 345678,
      "sort_order": 0
    },
    {
      "id": 31,
      "url": "https://bucket.s3.region.amazonaws.com/orders/photos/order_25_2.jpg",
      "path": "s3://orders/photos/order_25_2.jpg",
      "location": "s3",
      "filename": "order_25_2.jpg",
      "mime_type": "image/jpeg",
      "file_size": 298765,
      "sort_order": 1
    }
  ],
  "created_at": "2025-01-15T10:00:00.000000Z"
}
```

## Controller Updates

### UserController - Simplified (no manual formatting needed!)
```php
class UserController extends Controller
{
    public function show(User $user)
    {
        // Just load relationships - avatar_image is automatically included!
        $user->load('roles');
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function index(Request $request)
    {
        $users = User::with('roles')->paginate(15);
        
        // avatar_image is automatically included in each user object!
        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'meta' => [...]
        ]);
    }
}
```

### OrderController - Multiple Photos
```php
class OrderController extends Controller
{
    public function show(Order $order)
    {
        $order->load('customer', 'orderItems');
        
        // Get all photos for this order
        $photos = Resource::where('related_table', 'orders')
            ->where('related_id', $order->id)
            ->where('module', 'orders')
            ->where('folder', 'photos')
            ->orderBy('sort_order')
            ->get()
            ->map(function ($resource) {
                return [
                    'id' => $resource->id,
                    'url' => $resource->file_url,
                    'path' => $resource->file_path,
                    'location' => $resource->location,
                    'filename' => $resource->filename,
                    'mime_type' => $resource->mime_type,
                    'file_size' => $resource->file_size,
                    'sort_order' => $resource->sort_order,
                ];
            });

        $orderData = $order->toArray();
        $orderData['photos'] = $photos;

        return response()->json([
            'success' => true,
            'data' => $orderData
        ]);
    }
}
```

---

## Key Benefits

✅ **Automatic Inclusion**: Image objects automatically included in API responses  
✅ **Simple API**: No need to manually format - just return the model  
✅ **Consistent Structure**: All image objects have the same structure  
✅ **Location Tracking**: Easy to see if image is stored locally or on S3  
✅ **Complete Info**: URL, path, location, size, type - all in one object  

## Next Steps

1. ✅ **Review this proposal** - Using `related_table` + `related_id` approach
2. ✅ **Image objects in responses** - Automatically included via accessors
3. **Create migration file** once approved
4. **Create Resource model** with relationships
5. **Update FileUploadService** to create Resource records
6. **Update models** to include image accessors
7. **Migrate existing data** from current tables
8. **Update controllers** - Remove manual formatting, use automatic accessors
9. **Update frontend** to use new image object structure

---

*Last Updated: 2025-01-XX*  
*Proposed by: AI Assistant*

