<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\EmailService;
use App\Services\FileUploadService;
use App\Services\S3Service;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SettingController extends Controller
{
    protected $emailService;
    protected $s3Service;
    protected $fileUploadService;

    public function __construct(EmailService $emailService, S3Service $s3Service, FileUploadService $fileUploadService)
    {
        $this->emailService = $emailService;
        $this->s3Service = $s3Service;
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Get all settings or by group.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        return $this->listAll($request);
    }

    /**
     * Update settings by group.
     *
     * @param Request $request
     * @param string $group
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateGroup(Request $request, $group)
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($request->settings as $key => $value) {
            Setting::set($key, $value, $group);
        }

        // Reload service settings if applicable
        if ($group === 's3') {
            $this->s3Service->reloadSettings();
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    /**
     * Test S3 connection.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function testS3()
    {
        // Reload settings to get the latest values from database
        $this->s3Service->reloadSettings();
        
        $result = $this->s3Service->testConnection();

        return response()->json($result);
    }

    /**
     * Test email configuration.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function testEmail(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email|max:255',
            ]);

            $result = $this->emailService->sendEmailImmediately(
                $validated['email'],
                'test',
                [
                    'message' => 'This is a test email from ' . config('app.name'),
                    'timestamp' => now()->toDateTimeString(),
                ]
            );

            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Test email sent successfully to ' . $validated['email']
                ]);
            }

            // If result is false, check the logs for the actual error
            // The error should already be logged in EmailService
            return response()->json([
                'success' => false,
                'message' => 'Failed to send test email. Please check your email configuration and ensure SMTP Host is a valid hostname (not an email address). Check Laravel logs for details.'
            ], 500);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Test email error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            
            // Return user-friendly error message
            $errorMessage = $e->getMessage();
            
            // Provide helpful message for common SMTP host issues
            if (strpos($errorMessage, 'SMTP Host cannot be an email address') !== false) {
                return response()->json([
                    'success' => false,
                    'message' => $errorMessage
                ], 422);
            }
            
            return response()->json([
                'success' => false,
                'message' => $errorMessage ?: 'Failed to send test email. Please check your email configuration.'
            ], 500);
        }
    }

    /**
     * List all settings with optional section filter.
     */
    public function listAll(Request $request)
    {
        $query = Setting::query();

        if ($request->filled('section')) {
            $query->where('group', $request->input('section'));
        }

        if ($request->filled('sections')) {
            $sections = array_filter((array) $request->input('sections'));
            if (!empty($sections)) {
                $query->whereIn('group', $sections);
            }
        }

        $settings = $query
            ->orderBy('group')
            ->orderBy('key')
            ->get()
            ->map(fn (Setting $setting) => $this->formatSetting($setting));

        return response()->json($settings);
    }

    /**
     * Return settings grouped by section.
     */
    public function listBySection()
    {
        $grouped = Setting::query()
            ->orderBy('group')
            ->orderBy('key')
            ->get()
            ->groupBy('group')
            ->map(function ($settings, $group) {
                return [
                    'section' => $group,
                    'settings' => $settings
                        ->map(fn (Setting $setting) => $this->formatSetting($setting))
                        ->values(),
                ];
            })
            ->values();

        return response()->json($grouped);
    }

    /**
     * Return all settings within a specific section.
     */
    public function getSection(string $section)
    {
        $settings = Setting::where('group', $section)
            ->orderBy('key')
            ->get();

        if ($settings->isEmpty()) {
            return response()->json([
                'message' => 'Section not found',
            ], 404);
        }

        return response()->json([
            'section' => $section,
            'settings' => $settings
                ->map(fn (Setting $setting) => $this->formatSetting($setting))
                ->values(),
        ]);
    }

    /**
     * Upload business logo.
     */
    public function uploadLogo(Request $request)
    {
        try {
            $validated = $request->validate([
                'logo' => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
                'key' => 'required|string',
                'section' => 'required|string',
            ]);

            $file = $request->file('logo');
            $key = $validated['key'];
            $section = $validated['section'];

            $existingSetting = Setting::where('key', $key)
                ->where('group', $section)
                ->first();

            $filename = 'business_logo_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

            $uploadResult = $this->fileUploadService->replaceFile(
                $existingSetting->value ?? null,
                $file,
                'logos',
                $filename,
                'public',
                'settings'
            );

            \Log::info('Logo upload result', [
                'stored_in_s3' => $uploadResult['stored_in_s3'],
                'path' => $uploadResult['path'],
                'url' => $uploadResult['url'],
                's3_status' => $this->s3Service->getStatus(),
            ]);

            $setting = Setting::updateOrCreate(
                [
                    'key' => $key,
                    'group' => $section,
                ],
                [
                    'value' => $uploadResult['path'],
                    'description' => 'Business logo URL',
                ]
            );

            // MANDATORY: Create or update Resource record
            $existingResource = $setting->logoResource();
            if ($existingResource) {
                // Update existing resource
                // Normalize path before storing
                $normalizedPath = $this->fileUploadService->normalizeFilePath(
                    $uploadResult['path'],
                    $uploadResult['stored_in_s3']
                );
                
                $existingResource->update([
                    'filename' => $uploadResult['filename'] ?? basename($uploadResult['path']),
                    'file_path' => $normalizedPath, // Store normalized path only
                    'file_url' => null, // Don't store URL - generate dynamically
                    'location' => $uploadResult['stored_in_s3'] ? 's3' : 'local',
                    'storage_disk' => $uploadResult['stored_in_s3'] ? 's3' : 'uploads',
                ]);
            } else {
                // Create new resource - MANDATORY
                try {
                    $resource = $this->fileUploadService->createResource(
                        $uploadResult,
                        'settings',
                        $setting->id,
                        [
                            'file' => $file,
                            'module' => 'settings',
                            'folder' => 'logos',
                            'resource_type' => 'logo',
                            'is_primary' => true,
                            'visibility' => 'public',
                        ]
                    );
                    
                    if (!$resource) {
                        throw new \Exception('Resource creation returned null');
                    }
                } catch (\Exception $e) {
                    \Log::error('Failed to create Resource record for logo', [
                        'setting_id' => $setting->id,
                        'upload_result' => $uploadResult,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Logo uploaded but failed to save resource record: ' . $e->getMessage(),
                    ], 500);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Logo uploaded successfully',
                'data' => [
                    'id' => $setting->id,
                    'key' => $setting->key,
                    'value' => $setting->value,
                    'logo_url' => $uploadResult['url'],
                    'section' => $setting->group,
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Logo upload error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to upload logo: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created setting.
     */
    public function store(Request $request)
    {
        $section = $request->input('section', 'general');

        $validated = $request->validate([
            'key' => [
                'required',
                'string',
                'max:255',
                Rule::unique('settings')->where(fn ($query) => $query->where('group', $section)),
            ],
            'value' => 'nullable',
            'section' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $setting = Setting::create([
            'key' => $validated['key'],
            'value' => $this->normalizeValue($validated['value'] ?? null),
            'group' => $section,
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json($this->formatSetting($setting), 201);
    }

    /**
     * Display the specified setting.
     */
    public function show(Setting $setting)
    {
        return response()->json($this->formatSetting($setting));
    }

    /**
     * Display a setting by key (optional section filter).
     */
    public function showByKey(Request $request, string $key)
    {
        $section = $request->input('section');

        $query = Setting::where('key', $key);

        if ($section) {
            $query->where('group', $section);
        }

        $setting = $query->first();

        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        return response()->json($this->formatSetting($setting));
    }

    /**
     * Update the specified setting.
     */
    public function update(Request $request, Setting $setting)
    {
        $section = $request->input('section', $setting->group);

        $validated = $request->validate([
            'key' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('settings')->ignore($setting->id)->where(fn ($query) => $query->where('group', $section)),
            ],
            'value' => 'nullable',
            'section' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        if (isset($validated['key'])) {
            $setting->key = $validated['key'];
        }

        if (array_key_exists('value', $validated)) {
            $setting->value = $this->normalizeValue($validated['value']);
        }

        if (isset($validated['section'])) {
            $setting->group = $validated['section'];
        } elseif ($section !== $setting->group) {
            $setting->group = $section;
        }

        if (array_key_exists('description', $validated)) {
            $setting->description = $validated['description'];
        }

        $setting->save();

        return response()->json($this->formatSetting($setting));
    }

    /**
     * Update a setting by key (optionally scoped by section).
     */
    public function updateByKey(Request $request, string $key)
    {
        $section = $request->input('section');

        $query = Setting::where('key', $key);

        if ($section) {
            $query->where('group', $section);
        }

        $setting = $query->first();

        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        return $this->update($request, $setting);
    }

    /**
     * Remove the specified setting.
     */
    public function destroy(Setting $setting)
    {
        $setting->delete();

        return response()->json(['message' => 'Setting deleted successfully']);
    }

    /**
     * Remove a setting by key (optionally scoped by section).
     */
    public function destroyByKey(Request $request, string $key)
    {
        $section = $request->input('section');

        $query = Setting::where('key', $key);

        if ($section) {
            $query->where('group', $section);
        }

        $setting = $query->first();

        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        $setting->delete();

        return response()->json(['message' => 'Setting deleted successfully']);
    }

    /**
     * Normalize values prior to persistence.
     */
    protected function normalizeValue($value): ?string
    {
        if (is_null($value)) {
            return null;
        }

        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if (is_array($value) || is_object($value)) {
            return json_encode($value);
        }

        return (string) $value;
    }

    /**
     * Format a setting for API responses.
     */
    protected function formatSetting(Setting $setting): array
    {
        $value = $setting->value;
        
        // Convert storage paths to full URLs for logo settings
        if (in_array($setting->key, ['business_logo', 'logo']) && $value) {
            if (strpos($value, 's3://') === 0) {
                $s3Path = ltrim(substr($value, strlen('s3://')), '/');
                $s3Url = $this->s3Service->getFileUrl($s3Path);
                if ($s3Url) {
                    $value = $s3Url;
                }
            }

            // If it's already a full URL, keep it
            if (filter_var($value, FILTER_VALIDATE_URL)) {
                // Already a full URL, keep as is
            } 
            // If it's a relative path starting with /storage/ or /uploads/, convert to full URL
            elseif (strpos($value, '/storage/') === 0 || strpos($value, 'storage/') === 0 ||
                    strpos($value, '/uploads/') === 0 || strpos($value, 'uploads/') === 0) {
                // Get base URL from database settings (Web URL) or fallback to config
                $baseUrl = $this->getBaseUrl();
                $value = $baseUrl . (strpos($value, '/') === 0 ? $value : '/' . $value);
            }
        }
        
        return [
            'id' => $setting->id,
            'key' => $setting->key,
            'value' => $value,
            'section' => $setting->group,
            'description' => $setting->description,
            'created_at' => $setting->created_at,
            'updated_at' => $setting->updated_at,
        ];
    }

    /**
     * Get base URL from database settings or fallback to config.
     *
     * @return string
     */
    protected function getBaseUrl(): string
    {
        // Try to get Web URL from database settings (common key names)
        $webUrlKeys = ['web_url', 'Web URL', 'app_url', 'APP_URL', 'site_url', 'Site URL'];
        
        foreach ($webUrlKeys as $key) {
            $webUrl = Setting::get($key);
            if ($webUrl) {
                return rtrim($webUrl, '/');
            }
        }
        
        // Fallback to config if not found in database
        return rtrim(config('app.url'), '/');
    }
}

