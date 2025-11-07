<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
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

        return response()->json([
            'token' => $token,
            'user' => $user->load('roles'),
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
     * Get current authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        $user = $request->user();
        $permissions = $user->getAllPermissions();
        $permissionsByModule = $user->getPermissionsByModule();

        return response()->json([
            'user' => $user->load('roles'),
            'permissions' => $permissions,
            'permissionsByModule' => $permissionsByModule,
        ]);
    }

    /**
     * Send password reset link.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset link sent']);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }
}

