<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\SettingController;
use App\Http\Controllers\API\BranchController;
use App\Http\Controllers\API\PackageController;
use App\Http\Controllers\API\CustomerController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\DashboardController;

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
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::put('/auth/change-password', [AuthController::class, 'changePassword']);

    // User Management
    Route::get('/users', [UserController::class, 'index'])->middleware('permission:view_user');
    Route::post('/users', [UserController::class, 'store'])->middleware('permission:create_user');
    
    // User Profile (current user) - Must come before /users/{user} route
    Route::get('/users/profile', [UserController::class, 'profile']);
    Route::put('/users/profile', [UserController::class, 'updateProfile']);
    
    // User Management (by ID) - Must come after /users/profile
    Route::get('/users/{user}', [UserController::class, 'show'])->middleware('permission:view_user');
    Route::put('/users/{user}', [UserController::class, 'update'])->middleware('permission:edit_user');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware('permission:delete_user');

    // Role Management
    Route::get('/roles', [RoleController::class, 'index'])->middleware('permission:view_role');
    Route::post('/roles', [RoleController::class, 'store'])->middleware('permission:create_role');
    Route::get('/roles/{role}', [RoleController::class, 'show'])->middleware('permission:view_role');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->middleware('permission:edit_role');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->middleware('permission:delete_role');
    Route::put('/roles/{role}/permissions', [RoleController::class, 'updatePermissions'])->middleware('permission:edit_role');

    // Permission Management
    Route::get('/permissions', [PermissionController::class, 'index'])->middleware('permission:view_permission');
    Route::get('/permissions/{permission}', [PermissionController::class, 'show'])->middleware('permission:view_permission');

    // Branch Management
    Route::get('/branches', [BranchController::class, 'index'])->middleware('permission:view_branch');
    Route::post('/branches', [BranchController::class, 'store'])->middleware('permission:create_branch');
    Route::get('/branches/{branch}', [BranchController::class, 'show'])->middleware('permission:view_branch');
    Route::put('/branches/{branch}', [BranchController::class, 'update'])->middleware('permission:edit_branch');
    Route::delete('/branches/{branch}', [BranchController::class, 'destroy'])->middleware('permission:delete_branch');

    // Package Management
    Route::get('/packages', [PackageController::class, 'index'])->middleware('permission:view_package');
    Route::post('/packages', [PackageController::class, 'store'])->middleware('permission:create_package');
    Route::get('/packages/export-pdf', [PackageController::class, 'exportAllPdf'])->middleware('permission:view_package');
    Route::get('/packages/{package}/export-pdf', [PackageController::class, 'exportPdf'])->middleware('permission:view_package');
    Route::get('/packages/{package}', [PackageController::class, 'show'])->middleware('permission:view_package');
    Route::put('/packages/{package}', [PackageController::class, 'update'])->middleware('permission:edit_package');
    Route::delete('/packages/{package}', [PackageController::class, 'destroy'])->middleware('permission:delete_package');

    // Customer Management
    Route::get('/customers', [CustomerController::class, 'index'])->middleware('permission:view_customer');
    Route::post('/customers', [CustomerController::class, 'store'])->middleware('permission:create_customer');
    Route::get('/customers/export-pdf', [CustomerController::class, 'exportAllPdf'])->middleware('permission:view_customer');
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->middleware('permission:view_customer');
    Route::get('/customers/{customer}/export-pdf', [CustomerController::class, 'exportPdf'])->middleware('permission:view_customer');
    Route::put('/customers/{customer}', [CustomerController::class, 'update'])->middleware('permission:edit_customer');
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->middleware('permission:delete_customer');
    Route::put('/customers/{customer}/status', [CustomerController::class, 'updateStatus'])->middleware('permission:edit_customer');
    Route::post('/customers/{customer}/recalculate-stats', [CustomerController::class, 'recalculateStats'])->middleware('permission:edit_customer');

    // Order Management
    Route::get('/orders/stats', [OrderController::class, 'stats'])->middleware('permission:view_order');
    Route::get('/orders', [OrderController::class, 'index'])->middleware('permission:view_order');
    Route::get('/orders/export-pdf', [OrderController::class, 'exportAllPdf'])->middleware('permission:view_order');
    Route::post('/orders', [OrderController::class, 'store'])->middleware('permission:create_order');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->middleware('permission:view_order');
    Route::get('/orders/{order}/export-pdf', [OrderController::class, 'exportPdf'])->middleware('permission:view_order');
    Route::put('/orders/{order}', [OrderController::class, 'update'])->middleware('permission:edit_order');
    Route::delete('/orders/{order}', [OrderController::class, 'destroy'])->middleware('permission:delete_order');
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus'])->middleware('permission:edit_order');
    Route::put('/orders/{order}/payment-status', [OrderController::class, 'updatePaymentStatus'])->middleware('permission:edit_order');
    Route::get('/orders/customer/{customerId}', [OrderController::class, 'getByCustomer'])->middleware('permission:view_order');

    // Payment Management
    Route::get('/payments', [PaymentController::class, 'index'])->middleware('permission:view_payment');
    Route::get('/payments/export-pdf', [PaymentController::class, 'exportAllPdf'])->middleware('permission:view_payment');
    Route::post('/payments', [PaymentController::class, 'store'])->middleware('permission:create_payment');
    Route::get('/payments/{payment}', [PaymentController::class, 'show'])->middleware('permission:view_payment');
    Route::get('/payments/{payment}/export-pdf', [PaymentController::class, 'exportPdf'])->middleware('permission:view_payment');
    Route::put('/payments/{payment}', [PaymentController::class, 'update'])->middleware('permission:edit_payment');
    Route::delete('/payments/{payment}', [PaymentController::class, 'destroy'])->middleware('permission:delete_payment');
    Route::get('/payments/order/{orderId}', [PaymentController::class, 'getByOrder'])->middleware('permission:view_payment');

    // Dashboard
    Route::get('/dashboard/summary', [DashboardController::class, 'summary'])->middleware('permission:view_dashboard');
    Route::get('/dashboard/revenue-trend', [DashboardController::class, 'revenueTrend'])->middleware('permission:view_dashboard');
    Route::get('/dashboard/recent-activities', [DashboardController::class, 'recentActivities'])->middleware('permission:view_dashboard');

    // Settings
    Route::get('/settings', [SettingController::class, 'index'])->middleware('permission:view_setting');
    // Specific routes must come before parameterized routes
    Route::post('/settings/test-s3', [SettingController::class, 'testS3'])->middleware('permission:edit_setting');
    Route::post('/settings/test-email', [SettingController::class, 'testEmail'])->middleware('permission:edit_setting');
    Route::post('/settings/{group}', [SettingController::class, 'updateGroup'])->middleware('permission:edit_setting');

    Route::prefix('global-settings')->group(function () {
        Route::middleware('permission:view_setting')->group(function () {
            Route::get('/', [SettingController::class, 'listAll']);
            Route::get('/by-section', [SettingController::class, 'listBySection']);
            Route::get('/by-section/{section}', [SettingController::class, 'getSection']);
            Route::get('/key/{key}', [SettingController::class, 'showByKey']);
            Route::get('/{setting}', [SettingController::class, 'show']);
        });

        Route::middleware('permission:edit_setting')->group(function () {
            Route::post('/upload-logo', [SettingController::class, 'uploadLogo']);
            Route::post('/', [SettingController::class, 'store']);
            Route::put('/key/{key}', [SettingController::class, 'updateByKey']);
            Route::put('/{setting}', [SettingController::class, 'update']);
            Route::delete('/key/{key}', [SettingController::class, 'destroyByKey']);
            Route::delete('/{setting}', [SettingController::class, 'destroy']);
        });
    });
});

