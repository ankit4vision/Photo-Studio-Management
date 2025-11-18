<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\PaginatesResults;
use App\Models\Role;
use App\Models\User;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    use PaginatesResults;

    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Format user data with avatar URL.
     *
     * @param User $user
     * @return array
     */
    protected function formatUserData(User $user)
    {
        // Get raw attributes to avoid accessor interference
        $userData = $user->getAttributes();
        $userData['roles'] = $user->roles->toArray();
        $userData['created_at'] = $user->created_at;
        $userData['updated_at'] = $user->updated_at;
        
        // Convert avatar path to full URL
        $originalAvatar = $user->getOriginal('avatar') ?? $user->avatar;
        
        if ($originalAvatar) {
            $avatarUrl = $this->fileUploadService->getFileUrl($originalAvatar);
            
            // Debug logging
            \Log::info('Formatting user avatar', [
                'user_id' => $user->id,
                'original_avatar' => $originalAvatar,
                'generated_url' => $avatarUrl,
                'url_type' => gettype($avatarUrl),
                'is_valid_url' => $avatarUrl && filter_var($avatarUrl, FILTER_VALIDATE_URL)
            ]);
            
            // Only use URL if it's a valid HTTP(S) URL (not s3:// protocol)
            if ($avatarUrl && 
                is_string($avatarUrl) && 
                (strpos($avatarUrl, 'http://') === 0 || strpos($avatarUrl, 'https://') === 0) &&
                filter_var($avatarUrl, FILTER_VALIDATE_URL)) {
                $userData['avatar_url'] = $avatarUrl;
                $userData['avatar'] = $avatarUrl;
            } else {
                // If URL generation failed, log it
                \Log::warning('Failed to generate avatar URL', [
                    'avatar_path' => $originalAvatar,
                    'generated_url' => $avatarUrl,
                    'url_type' => gettype($avatarUrl),
                    'user_id' => $user->id
                ]);
                // Return null instead of the S3 path
                $userData['avatar_url'] = null;
                $userData['avatar'] = null;
            }
        } else {
            $userData['avatar_url'] = null;
            $userData['avatar'] = null;
        }
        
        return $userData;
    }

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
            function (User $user) {
                return $this->formatUserData($user);
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

        $user->load('roles');
        return response()->json($this->formatUserData($user), 201);
    }

    /**
     * Display the specified user.
     *
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(User $user)
    {
        $user->load('roles');
        return response()->json($this->formatUserData($user));
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

        $user->load('roles');
        return response()->json($this->formatUserData($user));
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
        
        return response()->json([
            'success' => true,
            'data' => $this->formatUserData($user),
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

        // Handle avatar upload using FileUploadService
        if ($request->has('avatar') && $request->avatar) {
            $avatarData = $request->avatar;
            
            // If empty string, delete avatar
            if ($avatarData === '') {
                if ($user->avatar) {
                    $this->fileUploadService->deleteFile($user->avatar);
                }
                $validated['avatar'] = null;
            } elseif (preg_match('/^data:image\/(\w+);base64,/', $avatarData, $matches)) {
                // Validate image type
                $imageType = $matches[1];
                $allowedTypes = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
                if (!in_array(strtolower($imageType), $allowedTypes)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid image type. Allowed types: JPEG, PNG, GIF, WebP',
                    ], 422);
                }

                // Generate unique filename
                $filename = 'user_' . $user->id . '_' . time() . '.' . $imageType;

                $uploadResult = $this->fileUploadService->replaceFile(
                    $user->avatar,
                    $avatarData,
                    'avatars',
                    $filename,
                    'public',
                    'users'
                );

                $validated['avatar'] = $uploadResult['path'];
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

        return response()->json([
            'success' => true,
            'data' => $this->formatUserData($user),
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

