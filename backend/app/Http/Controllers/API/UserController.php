<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\PaginatesResults;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    use PaginatesResults;

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

        if ($role = $request->input('role')) {
            $query->whereHas('roles', function ($roleQuery) use ($role) {
                if (is_numeric($role)) {
                    $roleQuery->where('id', (int) $role);
                } else {
                    $roleQuery->where('name', $role);
                }
            });
        }

        $pagination = $this->buildPaginator(
            $request,
            $query,
            ['first_name', 'last_name', 'email', 'created_at', 'status'],
            ['column' => 'created_at', 'direction' => 'desc']
        );

        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = $pagination['paginator'];

        $users = array_map(
            static function (User $user) {
                return $user->toArray();
            },
            $paginator->items()
        );

        return response()->json([
            'success' => true,
            'data' => $users,
            'meta' => $this->paginationMeta($paginator, $pagination['sortBy'], $pagination['sortDirection']),
        ]);
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
     * Get current authenticated user profile.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile(Request $request)
    {
        $user = $request->user()->load('roles');
        
        // Convert to array and add avatar_url
        $userData = $user->toArray();
        
        // Add avatar_url attribute
        if ($user->avatar) {
            if (!filter_var($user->avatar, FILTER_VALIDATE_URL)) {
                // Use asset() helper for public storage URLs
                $userData['avatar_url'] = asset('storage/' . $user->avatar);
            } else {
                $userData['avatar_url'] = $user->avatar;
            }
        } else {
            $userData['avatar_url'] = null;
        }
        
        return response()->json([
            'success' => true,
            'data' => $userData,
        ]);
    }

    /**
     * Update current authenticated user profile.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string|max:100',
            'zip_code' => 'nullable|string|max:20',
            'country' => 'nullable|string',
            'bio' => 'nullable|string',
            'avatar' => 'nullable|string', // Base64 encoded image or URL
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|in:male,female,other,prefer-not-to-say',
        ]);

        // Handle avatar upload (base64 to local file)
        if ($request->has('avatar') && $request->avatar) {
            $avatarData = $request->avatar;
            
            // If empty string, delete avatar
            if ($avatarData === '') {
                // Delete old avatar if exists
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }
                $validated['avatar'] = null;
            } 
            // If base64 image, save to local storage
            elseif (preg_match('/^data:image\/(\w+);base64,/', $avatarData, $matches)) {
                // Delete old avatar if exists
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }

                // Extract image data
                $imageData = substr($avatarData, strpos($avatarData, ',') + 1);
                $imageData = base64_decode($imageData);
                $imageType = $matches[1]; // jpeg, png, gif, webp
                
                // Validate image type
                $allowedTypes = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
                if (!in_array(strtolower($imageType), $allowedTypes)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid image type. Allowed types: JPEG, PNG, GIF, WebP',
                    ], 422);
                }

                // Generate unique filename
                $filename = 'avatars/user_' . $user->id . '_' . time() . '.' . $imageType;
                
                // Save to public storage
                Storage::disk('public')->put($filename, $imageData);
                
                // Store relative path in database
                $validated['avatar'] = $filename;
            }
            // If it's already a URL or path, keep it as is
            else {
                $validated['avatar'] = $avatarData;
            }
        }

        // Only update fields that are present in the request
        // Convert empty strings to null for nullable fields
        $updateData = [];
        $nullableFields = ['date_of_birth', 'gender', 'bio', 'address', 'city', 'state', 'zip_code', 'country', 'phone'];
        
        foreach ($validated as $key => $value) {
            // Convert empty strings to null for nullable fields
            if (in_array($key, $nullableFields) && $value === '') {
                $updateData[$key] = null;
            } else {
                $updateData[$key] = $value;
            }
        }
        
        $user->update($updateData);

        // Reload user to get fresh data
        $user->refresh();
        $user->load('roles');
        
        // Convert avatar path to full URL if it's a local file
        $avatarUrl = null;
        if ($user->avatar) {
            if (!filter_var($user->avatar, FILTER_VALIDATE_URL)) {
                // Use asset() helper for public storage URLs
                $avatarUrl = asset('storage/' . $user->avatar);
            } else {
                $avatarUrl = $user->avatar;
            }
        }
        
        // Add avatar_url to user array for response
        $userData = $user->toArray();
        $userData['avatar_url'] = $avatarUrl;

        return response()->json([
            'success' => true,
            'data' => $userData,
            'message' => 'Profile updated successfully',
        ]);
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

