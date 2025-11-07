<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\SettingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // User Management
    Route::apiResource('users', UserController::class);

    // Role Management
    Route::apiResource('roles', RoleController::class);
    Route::put('/roles/{role}/permissions', [RoleController::class, 'updatePermissions']);

    // Permission Management
    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::get('/permissions/{permission}', [PermissionController::class, 'show']);

    // Settings
    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings/{group}', [SettingController::class, 'updateGroup']);
    Route::post('/settings/test-s3', [SettingController::class, 'testS3']);
    Route::post('/settings/test-email', [SettingController::class, 'testEmail']);
});

