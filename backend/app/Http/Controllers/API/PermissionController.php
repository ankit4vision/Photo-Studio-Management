<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    /**
     * Display a listing of permissions.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Permission::query();

        if ($request->has('module')) {
            $query->where('module', $request->module);
        }

        if ($request->has('submodule')) {
            $query->where('submodule', $request->submodule);
        }

        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $query->where('is_deleted', false);

        $permissions = $query->get();

        // Group by module if requested
        if ($request->has('group_by_module')) {
            $grouped = [];
            foreach ($permissions as $permission) {
                $module = $permission->module ?? 'general';
                $submodule = $permission->submodule ?? 'general';

                if (!isset($grouped[$module])) {
                    $grouped[$module] = [];
                }

                if (!isset($grouped[$module][$submodule])) {
                    $grouped[$module][$submodule] = [];
                }

                $grouped[$module][$submodule][] = $permission;
            }

            return response()->json($grouped);
        }

        return response()->json($permissions);
    }

    /**
     * Display the specified permission.
     *
     * @param Permission $permission
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Permission $permission)
    {
        return response()->json($permission->load('roles'));
    }
}

