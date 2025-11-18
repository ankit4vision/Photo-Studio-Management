<?php

namespace App\Services;

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
        ];
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

        // If already a full URL, return as is
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        // Handle S3 paths
        if (strpos($path, 's3://') === 0) {
            $s3Path = ltrim(substr($path, strlen('s3://')), '/');
            return $this->s3Service->getFileUrl($s3Path);
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
}

