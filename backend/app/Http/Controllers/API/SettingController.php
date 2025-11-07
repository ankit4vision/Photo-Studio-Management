<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\EmailService;
use App\Services\S3Service;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    protected $emailService;
    protected $s3Service;

    public function __construct(EmailService $emailService, S3Service $s3Service)
    {
        $this->emailService = $emailService;
        $this->s3Service = $s3Service;
    }

    /**
     * Get all settings or by group.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        if ($request->has('group')) {
            $settings = Setting::getByGroup($request->group);
        } else {
            $settings = Setting::all();
        }

        return response()->json($settings);
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
        $request->validate([
            'email' => 'required|email',
        ]);

        $result = $this->emailService->sendEmailImmediately(
            $request->email,
            'test',
            ['message' => 'This is a test email']
        );

        if ($result) {
            return response()->json(['success' => true, 'message' => 'Test email sent successfully']);
        }

        return response()->json(['success' => false, 'message' => 'Failed to send test email'], 500);
    }
}

