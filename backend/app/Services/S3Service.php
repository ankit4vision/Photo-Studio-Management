<?php

namespace App\Services;

use App\Models\Setting;
use Aws\S3\S3Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class S3Service
{
    protected $s3Client;
    protected $bucket;
    protected $region;
    protected $enabled;

    /**
     * Constructor - Load S3 settings from database.
     */
    public function __construct()
    {
        $this->reloadSettings();
    }

    /**
     * Reload S3 settings from database.
     *
     * @return void
     */
    public function reloadSettings()
    {
        $settings = Setting::getAsArray('s3');
        
        // Log what we got from database (without sensitive data)
        Log::debug('S3 settings loaded from database', [
            'has_enabled' => isset($settings['enabled']),
            'enabled_value' => $settings['enabled'] ?? 'not set',
            'has_bucket' => isset($settings['bucket']),
            'has_region' => isset($settings['region']),
            'has_key' => isset($settings['key']),
            'has_secret' => isset($settings['secret']),
            'all_keys' => array_keys($settings)
        ]);

        // Accept both '1' and 'true' as enabled values
        $enabledValue = $settings['enabled'] ?? '0';
        $this->enabled = in_array($enabledValue, ['1', 'true', 1, true], true);
        
        Log::debug('S3 enabled status', [
            'enabled_value' => $enabledValue,
            'is_enabled' => $this->enabled
        ]);

        if ($this->enabled) {
            // Only use database settings - no .env fallback
            $this->bucket = $settings['bucket'] ?? null;
            $this->region = $settings['region'] ?? null;

            // Validate required settings are present
            if (empty($this->bucket) || empty($this->region)) {
                Log::error('S3 settings incomplete: bucket or region missing', [
                    'bucket' => $this->bucket,
                    'region' => $this->region
                ]);
                $this->enabled = false;
                return;
            }

            // Check for credentials
            $accessKey = $settings['key'] ?? null;
            $secretKey = $settings['secret'] ?? null;

            if (empty($accessKey) || empty($secretKey)) {
                Log::error('S3 credentials missing from database settings');
                $this->enabled = false;
                return;
            }

            $config = [
                'version' => 'latest',
                'region' => $this->region,
                'credentials' => [
                    'key' => $accessKey,
                    'secret' => $secretKey,
                ],
            ];

            // Optional settings
            if (isset($settings['endpoint']) && !empty($settings['endpoint'])) {
                $config['endpoint'] = $settings['endpoint'];
            }

            if (isset($settings['use_path_style'])) {
                $usePathStyleValue = $settings['use_path_style'];
                $config['use_path_style_endpoint'] = in_array($usePathStyleValue, ['1', 'true', 1, true], true);
            }

            try {
                $this->s3Client = new S3Client($config);
                Log::info('S3 Client initialized successfully', [
                    'bucket' => $this->bucket,
                    'region' => $this->region
                ]);
            } catch (\Exception $e) {
                Log::error('S3 Client initialization failed', [
                    'message' => $e->getMessage(),
                    'bucket' => $this->bucket,
                    'region' => $this->region
                ]);
                $this->enabled = false;
                $this->s3Client = null;
            }
        } else {
            // Reset when disabled
            $this->s3Client = null;
            $this->bucket = null;
            $this->region = null;
        }
    }

    /**
     * Upload file to S3.
     *
     * @param \Illuminate\Http\UploadedFile|string $file
     * @param string $path
     * @param string $visibility
     * @return string|false
     */
    public function uploadFile($file, $path, $visibility = 'public', $filename = null)
    {
        if (!$this->isEnabled() || !$this->s3Client || !$this->bucket) {
            Log::warning('S3 upload attempted but S3 is not enabled or client not initialized', [
                'enabled' => $this->enabled,
                'has_client' => !is_null($this->s3Client),
                'has_bucket' => !empty($this->bucket)
            ]);
            return false;
        }

        try {
            // Get file content
            if (is_string($file)) {
                $content = file_get_contents($file);
                $originalName = basename($file);
            } else {
                $content = file_get_contents($file->getRealPath());
                $originalName = $file->getClientOriginalName();
            }

            $finalName = $filename ?: $originalName;
            $fullPath = rtrim($path, '/') . '/' . ltrim($finalName, '/');

            // Use S3Client directly instead of Storage::disk('s3')
            // This ensures we use the database settings, not .env config
            // Note: ACLs are disabled for newer S3 buckets, so we don't set ACL
            // Public access should be controlled via bucket policy instead
            $putObjectParams = [
                'Bucket' => $this->bucket,
                'Key' => $fullPath,
                'Body' => $content,
            ];
            
            // Only set ACL if bucket supports it (for older buckets)
            // For newer buckets, use bucket policy for public access
            // Try without ACL first - if bucket doesn't allow ACLs, it will fail gracefully
            try {
                if ($visibility === 'public') {
                    // Try with ACL for backward compatibility with older buckets
                    $putObjectParams['ACL'] = 'public-read';
                }
                $this->s3Client->putObject($putObjectParams);
            } catch (\Exception $aclException) {
                // If ACL fails, try without ACL (for buckets with ACLs disabled)
                if (strpos($aclException->getMessage(), 'AccessControlListNotSupported') !== false || 
                    strpos($aclException->getMessage(), 'ACL') !== false) {
                    unset($putObjectParams['ACL']);
                    $this->s3Client->putObject($putObjectParams);
                    Log::info('S3 upload succeeded without ACL (bucket has ACLs disabled)', [
                        'bucket' => $this->bucket,
                        'path' => $fullPath
                    ]);
                } else {
                    // Re-throw if it's a different error
                    throw $aclException;
                }
            }

            Log::info('S3 upload successful', [
                'bucket' => $this->bucket,
                'path' => $fullPath,
                'visibility' => $visibility
            ]);

            return $fullPath;
        } catch (\Exception $e) {
            Log::error('S3 upload failed', [
                'message' => $e->getMessage(),
                'bucket' => $this->bucket ?? 'not set',
                'path' => $path,
                'filename' => $filename,
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Delete file from S3.
     *
     * @param string $path
     * @return bool
     */
    public function deleteFile($path)
    {
        if (!$this->isEnabled()) {
            return false;
        }

        try {
            Storage::disk('s3')->delete($path);
            return true;
        } catch (\Exception $e) {
            Log::error('S3 delete failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get public URL for file.
     *
     * @param string $path
     * @return string|false
     */
    public function getFileUrl($path)
    {
        Log::debug('S3Service::getFileUrl called', [
            'path' => $path,
            'isEnabled' => $this->isEnabled(),
            'hasClient' => !is_null($this->s3Client),
            'bucket' => $this->bucket,
            'region' => $this->region
        ]);
        
        if (!$this->isEnabled() || !$this->s3Client || !$this->bucket) {
            Log::warning('S3Service::getFileUrl returning false - S3 not properly configured', [
                'isEnabled' => $this->isEnabled(),
                'hasClient' => !is_null($this->s3Client),
                'hasBucket' => !empty($this->bucket),
                'hasRegion' => !empty($this->region)
            ]);
            return false;
        }

        try {
            // Construct public URL for S3 objects
            // Format: https://bucket-name.s3.region.amazonaws.com/path/to/file
            // For eu-north-1: https://bucket-name.s3.eu-north-1.amazonaws.com/path/to/file
            $publicUrl = "https://{$this->bucket}.s3.{$this->region}.amazonaws.com/{$path}";
            
            Log::debug('S3Service::getFileUrl generated URL', [
                'path' => $path,
                'generatedUrl' => $publicUrl
            ]);
            
            // For most use cases, we upload with public-read ACL, so return public URL
            // If you need presigned URLs for private files, we can add that later
            return $publicUrl;
        } catch (\Exception $e) {
            Log::error('S3 URL generation failed', [
                'message' => $e->getMessage(),
                'path' => $path,
                'bucket' => $this->bucket,
                'region' => $this->region,
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Test S3 connection.
     *
     * @return array
     */
    public function testConnection()
    {
        if (!$this->isEnabled()) {
            return [
                'success' => false,
                'message' => 'S3 is not enabled',
            ];
        }

        try {
            $this->s3Client->headBucket(['Bucket' => $this->bucket]);
            return [
                'success' => true,
                'message' => 'S3 connection successful',
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'S3 connection failed: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Check if S3 is enabled.
     *
     * @return bool
     */
    public function isEnabled()
    {
        $isEnabled = $this->enabled && $this->s3Client !== null;
        
        // Log status for debugging
        if (!$isEnabled) {
            Log::debug('S3 is not enabled', [
                'enabled' => $this->enabled,
                'has_client' => !is_null($this->s3Client),
                'has_bucket' => !empty($this->bucket),
                'has_region' => !empty($this->region)
            ]);
        }
        
        return $isEnabled;
    }
    
    /**
     * Get current S3 status for debugging.
     *
     * @return array
     */
    public function getStatus()
    {
        return [
            'enabled' => $this->enabled,
            'has_client' => !is_null($this->s3Client),
            'bucket' => $this->bucket,
            'region' => $this->region,
            'is_fully_enabled' => $this->isEnabled(),
        ];
    }
}

