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

        $this->enabled = isset($settings['enabled']) && $settings['enabled'] === '1';

        if ($this->enabled) {
            $this->bucket = $settings['bucket'] ?? config('filesystems.disks.s3.bucket');
            $this->region = $settings['region'] ?? config('filesystems.disks.s3.region', 'us-east-1');

            $config = [
                'version' => 'latest',
                'region' => $this->region,
            ];

            if (isset($settings['key']) && isset($settings['secret'])) {
                $config['credentials'] = [
                    'key' => $settings['key'],
                    'secret' => $settings['secret'],
                ];
            } else {
                $config['credentials'] = [
                    'key' => config('filesystems.disks.s3.key'),
                    'secret' => config('filesystems.disks.s3.secret'),
                ];
            }

            if (isset($settings['endpoint'])) {
                $config['endpoint'] = $settings['endpoint'];
            }

            if (isset($settings['use_path_style'])) {
                $config['use_path_style_endpoint'] = $settings['use_path_style'] === '1';
            }

            try {
                $this->s3Client = new S3Client($config);
            } catch (\Exception $e) {
                Log::error('S3 Client initialization failed: ' . $e->getMessage());
                $this->enabled = false;
            }
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
    public function uploadFile($file, $path, $visibility = 'public')
    {
        if (!$this->isEnabled()) {
            return false;
        }

        try {
            if (is_string($file)) {
                // File path
                $content = file_get_contents($file);
                $filename = basename($file);
            } else {
                // Uploaded file
                $content = file_get_contents($file->getRealPath());
                $filename = $file->getClientOriginalName();
            }

            $fullPath = rtrim($path, '/') . '/' . $filename;

            Storage::disk('s3')->put($fullPath, $content, $visibility);

            return $fullPath;
        } catch (\Exception $e) {
            Log::error('S3 upload failed: ' . $e->getMessage());
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
        if (!$this->isEnabled()) {
            return false;
        }

        try {
            return Storage::disk('s3')->url($path);
        } catch (\Exception $e) {
            Log::error('S3 URL generation failed: ' . $e->getMessage());
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
        return $this->enabled && $this->s3Client !== null;
    }
}

