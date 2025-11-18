<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Setting;
use App\Services\EmailService;
use App\Services\FileUploadService;

class AuthController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }
    /**
     * User login.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        $permissions = $user->getAllPermissions();
        $permissionsByModule = $user->getPermissionsByModule();

        $user->load('roles');

        return response()->json([
            'token' => $token,
            'user' => $this->formatUserData($user),
            'permissions' => $permissions,
            'permissionsByModule' => $permissionsByModule,
        ]);
    }

    /**
     * User logout.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Format user data with avatar URL.
     *
     * @param User $user
     * @return array
     */
    protected function formatUserData(User $user)
    {
        $userData = $user->toArray();
        
        // Convert avatar path to full URL
        if ($user->avatar) {
            $avatarUrl = $this->fileUploadService->getFileUrl($user->avatar);
            
            // Only use URL if it's a valid HTTP(S) URL (not s3:// protocol)
            if ($avatarUrl && 
                is_string($avatarUrl) && 
                (strpos($avatarUrl, 'http://') === 0 || strpos($avatarUrl, 'https://') === 0) &&
                filter_var($avatarUrl, FILTER_VALIDATE_URL)) {
                $userData['avatar_url'] = $avatarUrl;
                // Also update avatar field to URL for frontend compatibility
                $userData['avatar'] = $avatarUrl;
            } else {
                // If URL generation failed, log it and return null
                \Log::warning('Failed to generate avatar URL', [
                    'avatar_path' => $user->avatar,
                    'generated_url' => $avatarUrl,
                    'user_id' => $user->id
                ]);
                $userData['avatar_url'] = null;
                // Keep the path in avatar field but it won't be a valid URL
                $userData['avatar'] = null;
            }
        } else {
            $userData['avatar_url'] = null;
            $userData['avatar'] = null;
        }
        
        return $userData;
    }

    /**
     * Get current authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        $user = $request->user()->load('roles');
        $permissions = $user->getAllPermissions();
        $permissionsByModule = $user->getPermissionsByModule();

        return response()->json([
            'user' => $this->formatUserData($user),
            'permissions' => $permissions,
            'permissionsByModule' => $permissionsByModule,
        ]);
    }

    /**
     * Send password reset link.
     *
     * @param Request $request
     * @param EmailService $emailService
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(Request $request, EmailService $emailService)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Don't reveal if user exists or not for security
            \Log::info('Password reset requested for non-existent email', [
                'email' => $request->email
            ]);
            return response()->json([
                'success' => true, // Return success for security (don't reveal if user exists)
                'message' => 'If that email address exists in our system, we will send a password reset link.'
            ], 200);
        }

        // Generate password reset token
        $token = Password::createToken($user);

        // Build reset URL
        // Note: Frontend uses HashRouter, so we need to use # in the URL
        // Get web_url from App Settings, fallback to config, then to default
        $webUrl = Setting::get('web_url', 'App Settings');
        if (empty($webUrl)) {
            $webUrl = config('app.frontend_url', 'http://localhost:5173');
        }
        // Ensure web_url doesn't have trailing slash
        $webUrl = rtrim($webUrl, '/');
        $resetUrl = "{$webUrl}/#/reset-password?token={$token}&email=" . urlencode($user->email);

        // Send email using EmailService (uses database email settings)
        try {
            \Log::info('Attempting to send password reset email', [
                'user_id' => $user->id,
                'email' => $user->email,
                'reset_url' => $resetUrl
            ]);

            // sendEmailImmediately now throws exceptions on failure, returns true on success
            $emailSent = $emailService->sendEmailImmediately(
                $user->email,
                'password_reset',
                [
                    'user' => $user,
                    'url' => $resetUrl,
                    'token' => $token,
                ],
                $user->id,
                'user'
            );

            // If we reach here, email was sent successfully
            \Log::info('Password reset email sent successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'reset_url' => $resetUrl
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Password reset link has been sent to your email address.'
            ], 200);

        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();
            
            \Log::error('Password reset email exception', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $errorMessage,
                'trace' => $e->getTraceAsString()
            ]);

            // Provide user-friendly error message
            $userMessage = 'Failed to send password reset email. ';
            
            // Check for specific error types
            if (strpos($errorMessage, 'SMTP Host cannot be an email address') !== false) {
                $userMessage .= 'Email configuration error: SMTP Host is set incorrectly. Please configure Email Settings in the admin panel.';
            } elseif (strpos($errorMessage, 'Email configuration is incomplete') !== false) {
                $userMessage .= 'Email configuration is incomplete. Please configure Email Settings in the admin panel.';
            } elseif (strpos($errorMessage, 'Cannot connect to SMTP server') !== false || strpos($errorMessage, 'Connection could not be established') !== false) {
                $userMessage .= 'Cannot connect to email server. Please verify Email Settings configuration (SMTP Host, Port, Username, Password).';
            } else {
                $userMessage .= 'Please check your email configuration in Settings or contact administrator. Error: ' . $errorMessage;
            }

            return response()->json([
                'success' => false,
                'message' => $userMessage
            ], 500);
        }
    }

    /**
     * Reset password using token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Password has been reset successfully.'
            ], 200);
        }

        // Handle different error statuses
        $errorMessage = 'Failed to reset password.';
        switch ($status) {
            case Password::INVALID_TOKEN:
                $errorMessage = 'Invalid or expired reset token. Please request a new password reset.';
                break;
            case Password::INVALID_USER:
                $errorMessage = 'Invalid user. Please check your email address.';
                break;
            case Password::THROTTLED:
                $errorMessage = 'Too many reset attempts. Please try again later.';
                break;
            default:
                $errorMessage = __($status) ?: 'Failed to reset password. Please try again.';
        }

        throw ValidationException::withMessages([
            'email' => [$errorMessage],
        ]);
    }

    /**
     * Change password for authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        // Update password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Password changed successfully.'
        ], 200);
    }
}

