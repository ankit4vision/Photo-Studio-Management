<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = User::with('roles');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json($users);
    }

    /**
     * Store a newly created user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'status' => 'nullable|in:active,inactive',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
            'bio' => 'nullable|string',
            'roles' => 'nullable|array',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['status'] = $validated['status'] ?? 'active';

        $user = User::create($validated);

        $roleIds = $this->normalizeRoleIds($request->input('roles', []));
        if (!empty($roleIds)) {
            $user->roles()->sync($roleIds);
        }

        return response()->json($user->load('roles'), 201);
    }

    /**
     * Display the specified user.
     *
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(User $user)
    {
        return response()->json($user->load('roles'));
    }

    /**
     * Update the specified user.
     *
     * @param Request $request
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|min:8',
            'phone' => 'nullable|string|max:20',
            'status' => 'nullable|in:active,inactive',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
            'bio' => 'nullable|string',
            'roles' => 'nullable|array',
        ]);

        if (isset($validated['password']) && $validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $rolesInput = $request->input('roles', null);
        $user->update($validated);

        if (!is_null($rolesInput)) {
            $roleIds = $this->normalizeRoleIds($rolesInput);
            $user->roles()->sync($roleIds);
        }

        return response()->json($user->load('roles'));
    }

    /**
     * Remove the specified user.
     *
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Normalize role identifiers (IDs or names) into role IDs.
     *
     * @param array $roles
     * @return array
     *
     * @throws ValidationException
     */
    protected function normalizeRoleIds($roles)
    {
        if (empty($roles)) {
            return [];
        }

        $roles = is_array($roles) ? $roles : [$roles];

        $resolvedIds = collect($roles)
            ->map(function ($role) {
                if (is_numeric($role)) {
                    return Role::notDeleted()->where('is_active', true)->where('id', (int) $role)->value('id');
                }

                return Role::notDeleted()->where('is_active', true)->where('name', $role)->value('id');
            });

        if ($resolvedIds->contains(null)) {
            throw ValidationException::withMessages([
                'roles' => ['One or more roles are invalid or inactive.'],
            ]);
        }

        return $resolvedIds
            ->filter()
            ->unique()
            ->values()
            ->all();
    }
}

