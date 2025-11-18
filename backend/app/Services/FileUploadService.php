<?php

namespace App\Services;

use App\Models\Resource;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class FileUploadService
{
    protected $s3Service;

    public function __construct(S3Service $s3Service)
    {
        $this->s3Service = $s3Service;
    }

    /**
     * Upload a file (handles both S3 and local storage).
     *
     * @param UploadedFile|string $file File to upload (UploadedFile or base64 string)
     * @param string $folder Folder name (e.g., 'logos', 'avatars', 'photos', 'images', 'receipts')
     * @param string|null $filename Custom filename (optional)
     * @param string $visibility 'public' or 'private' (for S3)
     * @param string|null $module Module name (e.g., 'users', 'customers', 'orders', 'packages', 'branches', 'payments', 'settings')
     * @return array ['path' => string, 'url' => string, 'stored_in_s3' => bool, 'module' => string, 'folder' => string]
     */
    public function uploadFile($file, $folder, $filename = null, $visibility = 'public', $module = null)
    {
        // Reload S3 settings to ensure we have latest config from database
        $this->s3Service->reloadSettings();
        
        $useS3 = $this->s3Service->isEnabled();
        $storedInS3 = false;
        $relativePath = null;
        $fullUrl = null;
        
        // Log S3 status for debugging
        if ($useS3) {
            Log::info('S3 is enabled, attempting S3 upload', [
                'folder' => $folder,
                'module' => $module,
                'filename' => $filename
            ]);
        } else {
            Log::info('S3 is disabled, using local storage', [
                'folder' => $folder,
                'module' => $module
            ]);
        }

        // Build module-based path structure
        $pathParts = [];
        if ($module) {
            $pathParts[] = $module;
        }
        $pathParts[] = $folder;
        $basePath = implode('/', $pathParts);

        // Handle base64 string
        if (is_string($file) && preg_match('/^data:image\/(\w+);base64,/', $file, $matches)) {
            $imageType = $matches[1];
            $imageData = substr($file, strpos($file, ',') + 1);
            $imageData = base64_decode($imageData);
            
            // Generate filename if not provided
            if (!$filename) {
                $filename = $folder . '_' . time() . '_' . uniqid() . '.' . $imageType;
            }
            
            $fullPath = $basePath . '/' . $filename;

            if ($useS3) {
                // Upload to S3 - create a temporary file for S3Service
                $tempFile = sys_get_temp_dir() . '/' . $filename;
                file_put_contents($tempFile, $imageData);
                $s3Path = $this->s3Service->uploadFile($tempFile, $basePath, $visibility, $filename);
                @unlink($tempFile); // Clean up temp file
                
                if ($s3Path && $s3Path !== false) {
                    $relativePath = 's3://' . ltrim($s3Path, '/');
                    $fullUrl = $this->s3Service->getFileUrl($s3Path);
                    
                    // Verify S3 URL was generated
                    if (!$fullUrl) {
                        Log::warning('S3 upload succeeded but getFileUrl returned null', [
                            's3Path' => $s3Path,
                            'basePath' => $basePath,
                            'filename' => $filename
                        ]);
                        // Fallback to local if URL generation fails
                        $useS3 = false;
                    } else {
                        $storedInS3 = true;
                    }
                } else {
                    // Fallback to local if S3 upload fails
                    Log::warning('S3 upload failed, falling back to local storage', [
                        'basePath' => $basePath,
                        'filename' => $filename
                    ]);
                    $useS3 = false;
                }
            }

            if (!$useS3) {
                // Save to local storage
                Storage::disk('uploads')->put($fullPath, $imageData);
                $relativePath = '/uploads/' . $fullPath;
                $baseUrl = config('app.url');
                $fullUrl = $baseUrl . $relativePath;
            }
        }
        // Handle UploadedFile
        elseif ($file instanceof UploadedFile) {
            // Generate filename if not provided
            if (!$filename) {
                $extension = $file->getClientOriginalExtension();
                $filename = $folder . '_' . time() . '_' . uniqid() . '.' . $extension;
            }

            if ($useS3) {
                // Upload to S3
                $s3Path = $this->s3Service->uploadFile($file, $basePath, $visibility, $filename);
                if ($s3Path && $s3Path !== false) {
                    $relativePath = 's3://' . ltrim($s3Path, '/');
                    $fullUrl = $this->s3Service->getFileUrl($s3Path);
                    
                    // Verify S3 URL was generated
                    if (!$fullUrl) {
                        Log::warning('S3 upload succeeded but getFileUrl returned null', [
                            's3Path' => $s3Path,
                            'basePath' => $basePath,
                            'filename' => $filename
                        ]);
                        // Fallback to local if URL generation fails
                        $useS3 = false;
                    } else {
                        $storedInS3 = true;
                    }
                } else {
                    // Fallback to local if S3 upload fails
                    Log::warning('S3 upload failed, falling back to local storage', [
                        'basePath' => $basePath,
                        'filename' => $filename
                    ]);
                    $useS3 = false;
                }
            }

            if (!$useS3) {
                // Save to local storage with module structure
                $path = Storage::disk('uploads')->putFileAs($basePath, $file, $filename);
                $relativePath = '/uploads/' . $path;
                $baseUrl = config('app.url');
                $fullUrl = $baseUrl . $relativePath;
            }
        } else {
            throw new \InvalidArgumentException('Invalid file type. Expected UploadedFile or base64 string.');
        }

        return [
            'path' => $relativePath,
            'url' => $fullUrl,
            'stored_in_s3' => $storedInS3,
            'module' => $module,
            'folder' => $folder,
            'filename' => $filename,
        ];
    }

    /**
     * Create a Resource record for an uploaded file.
     *
     * @param array $uploadResult Result from uploadFile() method
     * @param string $relatedTable Table name (e.g., 'users', 'customers', 'settings')
     * @param int $relatedId Record ID in the related table
     * @param array $options Additional options (resource_type, is_primary, sort_order, etc.)
     * @return Resource|null
     */
    public function createResource(array $uploadResult, string $relatedTable, int $relatedId, array $options = [])
    {
        try {
            // Get file info
            $file = $options['file'] ?? null;
            $originalFilename = null;
            $fileSize = null;
            $mimeType = null;
            $fileExtension = null;

            if ($file instanceof UploadedFile) {
                $originalFilename = $file->getClientOriginalName();
                $fileSize = $file->getSize();
                $mimeType = $file->getMimeType();
                $fileExtension = $file->getClientOriginalExtension();
            } elseif (is_string($file) && preg_match('/^data:image\/(\w+);base64,/', $file, $matches)) {
                $fileExtension = $matches[1];
                $mimeType = 'image/' . $fileExtension;
                $imageData = substr($file, strpos($file, ',') + 1);
                $imageData = base64_decode($imageData);
                $fileSize = strlen($imageData);
            }

            // Extract extension from filename if not set
            if (!$fileExtension && isset($uploadResult['filename'])) {
                $fileExtension = pathinfo($uploadResult['filename'], PATHINFO_EXTENSION);
            }

            // Validate required fields
            if (empty($uploadResult['module']) && empty($options['module'])) {
                throw new \Exception('Module is required for Resource creation');
            }
            if (empty($uploadResult['folder']) && empty($options['folder'])) {
                throw new \Exception('Folder is required for Resource creation');
            }

            // Normalize file_path: Store only relative path (no s3:// prefix, no /uploads/ prefix)
            $normalizedPath = $this->normalizeFilePath($uploadResult['path'], $uploadResult['stored_in_s3']);
            
            $resource = Resource::create([
                'filename' => $uploadResult['filename'] ?? basename($uploadResult['path']),
                'original_filename' => $originalFilename,
                'file_path' => $normalizedPath, // Store normalized relative path only
                'file_url' => null, // Don't store full URL - generate dynamically
                'file_size' => $fileSize,
                'mime_type' => $mimeType,
                'file_extension' => $fileExtension,
                'location' => $uploadResult['stored_in_s3'] ? 's3' : 'local',
                'storage_disk' => $uploadResult['stored_in_s3'] ? 's3' : 'uploads',
                'module' => $uploadResult['module'] ?? $options['module'],
                'folder' => $uploadResult['folder'] ?? $options['folder'],
                'resource_type' => $options['resource_type'] ?? null,
                'related_table' => $relatedTable,
                'related_id' => $relatedId,
                'title' => $options['title'] ?? null,
                'description' => $options['description'] ?? null,
                'alt_text' => $options['alt_text'] ?? null,
                'is_primary' => $options['is_primary'] ?? false,
                'sort_order' => $options['sort_order'] ?? 0,
                'visibility' => $options['visibility'] ?? 'public',
                'status' => 'active',
                'uploaded_by' => auth()->id(),
            ]);

            Log::info('Resource record created successfully', [
                'resource_id' => $resource->id,
                'related_table' => $relatedTable,
                'related_id' => $relatedId,
                'location' => $resource->location,
                'module' => $resource->module,
                'folder' => $resource->folder,
            ]);

            return $resource;
        } catch (\Exception $e) {
            Log::error('Failed to create Resource record', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'related_table' => $relatedTable,
                'related_id' => $relatedId,
                'upload_result' => $uploadResult,
                'options' => $options,
            ]);
            // Re-throw exception so controllers can handle it
            throw new \Exception('Failed to create Resource record: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Replace an existing file by deleting it (if present) and uploading the new one.
     *
     * @param string|null $existingPath Path currently stored in DB (S3 or local)
     * @param UploadedFile|string $file New file (UploadedFile or base64 string)
     * @param string $folder Destination folder (e.g., 'logos', 'avatars')
     * @param string|null $filename Optional filename override
     * @param string $visibility Visibility for S3 uploads
     * @param string|null $module Module name (e.g., 'settings', 'users')
     * @return array Same response as uploadFile()
     */
    public function replaceFile(?string $existingPath, $file, string $folder, $filename = null, string $visibility = 'public', ?string $module = null)
    {
        if ($existingPath) {
            try {
                $this->deleteFile($existingPath);
            } catch (\Throwable $e) {
                Log::warning('Failed to delete existing file before replacement', [
                    'path' => $existingPath,
                    'module' => $module,
                    'folder' => $folder,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $this->uploadFile($file, $folder, $filename, $visibility, $module);
    }

    /**
     * Delete a file (handles both S3 and local storage).
     *
     * @param string $path File path (can be relative path, S3 path, or full URL)
     * @return bool
     */
    public function deleteFile($path)
    {
        if (!$path) {
            return false;
        }

        // Extract path from URL if it's a full URL
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            $path = parse_url($path, PHP_URL_PATH) ?? $path;
        }

        // Handle S3 paths
        if (strpos($path, 's3://') === 0) {
            $s3Path = ltrim(substr($path, strlen('s3://')), '/');
            return $this->s3Service->deleteFile($s3Path);
        }

        // Handle local storage paths
        $oldDisk = 'uploads';
        $oldStoragePath = $path;

        // Handle old /storage/ paths (backward compatibility)
        if (strpos($path, '/storage/') !== false) {
            $oldDisk = 'public';
            $oldStoragePath = str_replace('/storage/', '', $path);
        } elseif (strpos($path, '/uploads/') !== false) {
            $oldDisk = 'uploads';
            $oldStoragePath = str_replace('/uploads/', '', $path);
        } else {
            // Path like 'avatars/filename.jpg' (no leading slash)
            $oldStoragePath = $path;
        }

        if (Storage::disk($oldDisk)->exists($oldStoragePath)) {
            return Storage::disk($oldDisk)->delete($oldStoragePath);
        }

        return false;
    }

    /**
     * Get file URL from stored path.
     *
     * @param string $path Stored path (relative, S3 path, or full URL)
     * @param string|null $baseUrl Custom base URL (optional, defaults to config)
     * @return string|null
     */
    public function getFileUrl($path, $baseUrl = null)
    {
        if (!$path) {
            return null;
        }

        // Handle S3 paths FIRST (before URL validation, since s3:// is a valid URL scheme)
        if (strpos($path, 's3://') === 0) {
            Log::debug('FileUploadService::getFileUrl - Processing S3 path', [
                'originalPath' => $path
            ]);
            
            // Reload S3 settings to ensure we have latest config
            $this->s3Service->reloadSettings();
            
            $s3Path = ltrim(substr($path, strlen('s3://')), '/');
            
            Log::debug('FileUploadService::getFileUrl - Extracted S3 path', [
                's3Path' => $s3Path,
                'isEnabled' => $this->s3Service->isEnabled()
            ]);
            
            // Only try S3 if it's enabled
            if ($this->s3Service->isEnabled()) {
                Log::debug('FileUploadService::getFileUrl - Calling S3Service::getFileUrl', [
                    's3Path' => $s3Path
                ]);
                
                $s3Url = $this->s3Service->getFileUrl($s3Path);
                
                Log::debug('FileUploadService::getFileUrl - S3Service returned', [
                    's3Url' => $s3Url,
                    's3UrlType' => gettype($s3Url),
                    'isString' => is_string($s3Url),
                    'startsWithHttp' => $s3Url && is_string($s3Url) ? (strpos($s3Url, 'http://') === 0 || strpos($s3Url, 'https://') === 0) : false
                ]);
                
                // If S3 service returns a valid HTTPS/HTTP URL, return it
                // Must be a real HTTP(S) URL, not s3:// protocol
                if ($s3Url && 
                    $s3Url !== false && 
                    is_string($s3Url) && 
                    (strpos($s3Url, 'http://') === 0 || strpos($s3Url, 'https://') === 0) &&
                    filter_var($s3Url, FILTER_VALIDATE_URL)) {
                    Log::debug('FileUploadService::getFileUrl - Returning valid HTTPS URL', [
                        'url' => $s3Url
                    ]);
                    return $s3Url;
                }
                
                // If S3 is enabled but URL generation failed, log it
                Log::warning('FileUploadService::getFileUrl - S3 URL generation failed or returned invalid URL', [
                    's3Path' => $s3Path,
                    's3Url' => $s3Url,
                    's3UrlType' => gettype($s3Url),
                    'originalPath' => $path,
                    's3Status' => $this->s3Service->getStatus()
                ]);
            } else {
                Log::debug('FileUploadService::getFileUrl - S3 is not enabled', [
                    's3Path' => $s3Path,
                    'originalPath' => $path,
                    's3Status' => $this->s3Service->getStatus()
                ]);
            }
            
            // If S3 is not enabled or URL generation failed, return null
            // The file might have been uploaded to S3 but S3 is now disabled
            Log::debug('FileUploadService::getFileUrl - Returning null for S3 path', [
                'originalPath' => $path
            ]);
            return null;
        }

        // If already a full HTTP(S) URL, return as is
        if (filter_var($path, FILTER_VALIDATE_URL) && 
            (strpos($path, 'http://') === 0 || strpos($path, 'https://') === 0)) {
            return $path;
        }

        // Handle local storage paths
        $baseUrl = $baseUrl ?? config('app.url');

        // Handle /storage/ paths (old format)
        if (strpos($path, '/storage/') === 0 || strpos($path, 'storage/') === 0) {
            return $baseUrl . (strpos($path, '/') === 0 ? $path : '/' . $path);
        }

        // Handle /uploads/ paths (new format)
        if (strpos($path, '/uploads/') === 0 || strpos($path, 'uploads/') === 0) {
            return $baseUrl . (strpos($path, '/') === 0 ? $path : '/' . $path);
        }

        // If path doesn't start with /, assume it's a relative path
        if (strpos($path, '/') !== 0) {
            return $baseUrl . '/uploads/' . $path;
        }

        return $baseUrl . $path;
    }

    /**
     * Normalize file path to store only relative path (no s3:// prefix, no /uploads/ prefix).
     * This makes paths bucket-agnostic and allows easy migration.
     *
     * @param string $path Original path (e.g., "s3://users/avatars/file.jpg" or "/uploads/users/avatars/file.jpg")
     * @param bool $isS3 Whether the file is stored in S3
     * @return string Normalized relative path (e.g., "users/avatars/file.jpg")
     */
    public function normalizeFilePath(string $path, bool $isS3): string
    {
        // Remove s3:// prefix if present
        if (strpos($path, 's3://') === 0) {
            $path = substr($path, 5); // Remove "s3://"
        }
        
        // Remove /uploads/ prefix if present
        $path = ltrim($path, '/');
        if (strpos($path, 'uploads/') === 0) {
            $path = substr($path, 8); // Remove "uploads/"
        }
        
        // Ensure no leading slashes
        return ltrim($path, '/');
    }
}

