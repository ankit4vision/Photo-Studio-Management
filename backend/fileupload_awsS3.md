# File Upload & AWS S3 Guide

Single reference for the module-based `FileUploadService` **and** the AWS S3 configuration used by Photo Studio Management.

---

## 1. Platform Overview
- All upload logic lives in `App\Services\FileUploadService`.
- Storage decisions are made at runtime by `App\Services\S3Service` (settings are pulled from DB, not `.env`).
- When S3 is enabled the service writes to `s3://{bucket}/{module}/{folder}/filename`. If S3 is disabled or fails it falls back to `public/uploads/{module}/{folder}/filename` automatically.
- Database records always store the relative path (`s3://settings/logos/...` or `/uploads/users/avatars/...`). Controllers/components must call `FileUploadService::getFileUrl()` to obtain a browser-ready URL.

### Required DB Settings (`group = s3`)
| Key | Description |
| --- | --- |
| `enabled` | `'1'` / `'true'` to enable S3 uploads |
| `bucket` | e.g. `codexaa-dev` |
| `region` | e.g. `eu-north-1` |
| `key` | AWS Access Key ID |
| `secret` | AWS Secret Access Key (encrypted in DB) |
| `use_path_style` | `'1'` to force path-style URLs (MinIO, etc.) |
| `endpoint` | Optional custom endpoint |

---

## 2. Folder & Module Structure

### Local
```
public/uploads/
├── users/avatars/user_1_1234567890.jpg
├── settings/logos/business_logo_1234567890.webp
├── customers/photos/customer_5_1234567890.jpg
├── orders/photos/order_10_1234567890.jpg
├── packages/images/package_3_1234567890.jpg
├── branches/images/branch_2_1234567890.jpg
└── payments/receipts/payment_15_1234567890.pdf
```

### S3
```
s3://{bucket}/
├── users/avatars/...
├── settings/logos/...
├── customers/photos/...
├── orders/photos/...
├── packages/images/...
├── branches/images/...
└── payments/receipts/...
```

---

## 3. Using `FileUploadService`

### Basic Upload
```php
$result = $this->fileUploadService->uploadFile(
    $request->file('photo') ?? $base64String,
    'avatars',          // folder
    null,               // optional filename
    'public',           // visibility
    'users'             // module
);

// $result = ['path' => 's3://users/avatars/...', 'url' => 'https://...', 'stored_in_s3' => true]
```

### Replace Existing File
Use the new helper when the UI replaces a logo/avatar:
```php
$result = $this->fileUploadService->replaceFile(
    $existingPath,      // deletes old file if present (S3 or local)
    $fileOrBase64,
    'logos',
    'business_logo_' . time() . '.webp',
    'public',
    'settings'
);
```

### Common Examples
- **Business logo (`SettingController`)** → module `settings`, folder `logos`, accepts `UploadedFile`.
- **User avatar (`UserController`)** → module `users`, folder `avatars`, accepts base64 or existing URL.
- **Customer/order/package/branch images** follow the same pattern: pick a module + folder + filename, then store the returned `path` in the DB.

### Helper APIs
- `getFileUrl($path)` → Converts any stored path (local, S3, or already absolute) into a usable URL.
- `deleteFile($path)` → Removes files from the correct storage disk/bucket.
- `replaceFile($existingPath, $file, $folder, $filename = null, $visibility = 'public', $module = null)` → convenience wrapper around delete + upload.

---

## 4. Configuring AWS S3

### A. Create Bucket
1. AWS Console → **S3** → **Create bucket**.
2. Name must be unique (e.g. `codexaa-dev`).
3. Select the region that will be entered in the app (must match exactly).
4. Object Ownership: **Bucket owner enforced (recommended)**.
5. Keep “Block *all* public access” enabled unless you plan to serve files publicly.

### B. Optional Public Access Policy
Needed only when avatars/logos must be public without signed URLs:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::codexaa-dev/*"
    }
  ]
}
```
Replace `codexaa-dev` with your bucket.

### C. IAM User
1. AWS Console → **IAM** → **Users** → **Add user**.
2. Enable programmatic access.
3. Attach **AmazonS3FullAccess** or the minimal policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::codexaa-dev",
        "arn:aws:s3:::codexaa-dev/*"
      ]
    }
  ]
}
```
4. Store the Access Key ID & Secret Access Key securely.

### D. ACLs vs. Policies
- AWS now disables ACLs when “Bucket owner enforced” is on.
- Our uploads never set ACLs—public access must be granted via bucket policy/CloudFront.
- If the bucket remains private, expose assets with signed URLs (future enhancement).

---

## 5. Entering Settings in the Admin UI
1. Navigate to **Settings → S3 Bucket Settings**.
2. Toggle **Enable S3 Uploads** ON.
3. Fill bucket, region, access key, secret, and optional path-style/endpoint.
4. Each field saves on blur; re-enter the secret when updating.
5. Click **Test S3 Connection**. Success switches uploads to S3; failure keeps them local—check `storage/logs/laravel.log` for details.

---

## 6. Troubleshooting

| Symptom | Diagnosis | Fix |
| --- | --- | --- |
| Uploads still local | Log entry: `S3 is disabled, using local storage` | Ensure `enabled=1` and all required keys are saved |
| `AccessControlListNotSupported` | 400 response in logs | Bucket has ACLs disabled; our code already avoids ACLs—ensure no manual ACLs exist |
| `AccessDenied` in browser | XML error when loading file | Add bucket policy or serve via signed URL/CloudFront |
| `SignatureDoesNotMatch` | AWS rejects upload | Region or credentials mismatch |
| `S3 is not enabled` | Service log message | Toggle S3 settings and re-enter secret |

---

## 7. Best Practices
- Separate IAM users/keys per environment.
- Use least-privilege bucket policies (Put/Get/Delete/List only).
- Never store secrets in `.env`; always use the Settings form (values are encrypted).
- Keep bucket names/regions consistent across AWS settings and the app.
- Consider CloudFront for production caching + SSL termination.

---

## 8. Quick Checklist
1. [ ] Bucket created & region noted.
2. [ ] Policy decided (public or signed URLs).
3. [ ] IAM user + keys stored.
4. [ ] Admin settings completed (bucket, region, key, secret, enable toggle).
5. [ ] **Test S3 Connection** succeeds.
6. [ ] Upload logo/avatar → confirm URL resolves (S3 or local as expected).

---

## 9. Common Upload API
Use the new endpoint for any module needing uploads (business logo, user avatar, package image, etc.).

### Endpoint
- `POST /api/uploads`
- Authenticated via Sanctum (same session as the admin app)
- Payload (either `multipart/form-data` or JSON for base64 uploads)

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `file` | file | required\* | Standard file input. Required when `file_base64` is empty. |
| `file_base64` | string | required\* | Base64 data URI (e.g. `data:image/png;base64,...`). Required when `file` missing. |
| `module` | string | yes | e.g. `users`, `settings`, `customers`, etc. |
| `folder` | string | yes | e.g. `avatars`, `logos`, `photos`. |
| `filename` | string | no | Optional explicit filename; service auto-generates if omitted. |
| `visibility` | string | no | `public` (default) or `private` (S3 only). |
| `existing_path` | string | no | When provided, the service deletes this path before saving the new file. |

### Response
```json
{
  "success": true,
  "data": {
    "path": "s3://settings/logos/business_logo_...webp",
    "url": "https://codexaa-dev.s3.eu-north-1.amazonaws.com/settings/logos/...",
    "stored_in_s3": true,
    "module": "settings",
    "folder": "logos"
  }
}
```

### Frontend Usage

A reusable `ImageUploadWithUpload` component is available at `admin/src/components/common/ImageUploadWithUpload.jsx`:

**Features:**
- Accepts `module`, `folder`, `existingPath`, `visibility`, etc. via props
- Handles file selection, validation, and automatic upload
- Displays upload progress and success/error states
- Supports drag & drop
- Automatically calls `/api/uploads` endpoint
- Returns `path` (for DB storage) and `url` (for display) via `onChange` callback

**Example:**
```jsx
import { ImageUploadWithUpload } from '../components'

<ImageUploadWithUpload
  value={logoUrl}
  onChange={(path, url, uploadResult) => setLogoPath(path)}
  label="Business Logo"
  module="settings"
  folder="logos"
  existingPath={currentLogoPath}
  visibility="public"
/>
```

**Upload Service:**
The `uploadService` provides helper methods for common uploads:
- `uploadService.uploadAvatar(file, userId, existingPath)`
- `uploadService.uploadLogo(file, existingPath)`
- `uploadService.uploadCustomerPhoto(file, customerId, existingPath)`
- `uploadService.uploadFile(file, options)` - Generic method

Modules that need to persist paths (e.g. settings, users) can use the component, which automatically uploads and returns the path for storage.

