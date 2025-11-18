<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'status',
        'address',
        'city',
        'state',
        'zip_code',
        'country',
        'bio',
        'avatar',
        'date_of_birth',
        'gender',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['avatar_image'];

    /**
     * Get the avatar URL attribute (backward compatibility).
     *
     * @return string|null
     */
    public function getAvatarUrlAttribute()
    {
        if (!$this->avatar) {
            return null;
        }

        // If it's already a full URL, return as is
        if (filter_var($this->avatar, FILTER_VALIDATE_URL)) {
            return $this->avatar;
        }

        // Handle S3 paths (s3://path/to/file)
        if (strpos($this->avatar, 's3://') === 0) {
            // S3 URLs should be handled by FileUploadService in controllers
            // For now, return null and let controllers handle it
            return null;
        }

        // Handle /uploads/ paths (new format)
        if (strpos($this->avatar, '/uploads/') === 0 || strpos($this->avatar, 'uploads/') === 0) {
            $baseUrl = config('app.url');
            return $baseUrl . (strpos($this->avatar, '/') === 0 ? $this->avatar : '/uploads/' . $this->avatar);
        }

        // Handle old /storage/ paths (backward compatibility)
        if (strpos($this->avatar, '/storage/') === 0 || strpos($this->avatar, 'storage/') === 0) {
            $baseUrl = config('app.url');
            return $baseUrl . (strpos($this->avatar, '/') === 0 ? $this->avatar : '/storage/' . $this->avatar);
        }

        // Otherwise, return public storage URL (old format: avatars/filename.jpg)
        return \Illuminate\Support\Facades\Storage::disk('public')->url($this->avatar);
    }

    /**
     * Get resources relationship.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function resources()
    {
        return Resource::where('related_table', 'users')
            ->where('related_id', $this->id);
    }

    /**
     * Get avatar resource.
     *
     * @return Resource|null
     */
    public function avatarResource()
    {
        return Resource::where('related_table', 'users')
            ->where('related_id', $this->id)
            ->where('module', 'users')
            ->where('folder', 'avatars')
            ->where('resource_type', 'avatar')
            ->where('is_primary', true)
            ->where('status', 'active')
            ->first();
    }

    /**
     * Get avatar image object for API responses.
     * ONLY from Resource table - no fallback to avatar path.
     *
     * @return array|null
     */
    public function getAvatarImageAttribute()
    {
        $resource = $this->avatarResource();
        
        if (!$resource) {
            return null;
        }

        return $resource->toImageObject();
    }

    /**
     * Get the roles that belong to the user.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user');
    }

    /**
     * Check if user has a specific role.
     *
     * @param string $role
     * @return bool
     */
    public function hasRole($role)
    {
        return $this->roles()
            ->where('name', $role)
            ->where('is_active', true)
            ->exists();
    }

    /**
     * Check if user has a specific permission.
     * Admin role has all permissions.
     *
     * @param string $permission
     * @return bool
     */
    public function hasPermission($permission)
    {
        // Admin role has all permissions
        if ($this->hasRole('admin')) {
            return true;
        }

        return $this->roles()
            ->where('is_active', true)
            ->whereHas('permissions', function ($query) use ($permission) {
                $query->where('name', $permission)
                    ->where('is_active', true);
            })
            ->exists();
    }

    /**
     * Check if user has any of the given permissions.
     *
     * @param array $permissions
     * @return bool
     */
    public function hasAnyPermission($permissions)
    {
        if ($this->hasRole('admin')) {
            return true;
        }

        return $this->roles()
            ->where('is_active', true)
            ->whereHas('permissions', function ($query) use ($permissions) {
                $query->whereIn('name', $permissions)
                    ->where('is_active', true);
            })
            ->exists();
    }

    /**
     * Check if user has all of the given permissions.
     *
     * @param array $permissions
     * @return bool
     */
    public function hasAllPermissions($permissions)
    {
        if ($this->hasRole('admin')) {
            return true;
        }

        $userPermissionCount = $this->roles()
            ->where('is_active', true)
            ->whereHas('permissions', function ($query) use ($permissions) {
                $query->whereIn('name', $permissions)
                    ->where('is_active', true);
            })
            ->withCount(['permissions' => function ($query) use ($permissions) {
                $query->whereIn('name', $permissions)
                    ->where('is_active', true);
            }])
            ->count();

        return $userPermissionCount >= count($permissions);
    }

    /**
     * Get all permissions for the user.
     * Admin role gets all active permissions.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllPermissions()
    {
        if ($this->hasRole('admin')) {
            return Permission::where('is_active', true)->get();
        }

        return Permission::whereHas('roles', function ($query) {
            $query->whereHas('users', function ($q) {
                $q->where('users.id', $this->id);
            })
                ->where('is_active', true);
        })
            ->where('is_active', true)
            ->distinct()
            ->get();
    }

    /**
     * Get permissions grouped by module.
     *
     * @param string|null $module
     * @return array
     */
    public function getPermissionsByModule($module = null)
    {
        $permissions = $this->getAllPermissions();

        $grouped = [];
        foreach ($permissions as $permission) {
            $mod = $permission->module ?? 'general';
            $submod = $permission->submodule ?? 'general';

            if (!isset($grouped[$mod])) {
                $grouped[$mod] = [];
            }

            if (!isset($grouped[$mod][$submod])) {
                $grouped[$mod][$submod] = [];
            }

            $grouped[$mod][$submod][] = [
                'id' => $permission->id,
                'name' => $permission->name,
                'description' => $permission->description,
                'type' => $permission->type,
            ];
        }

        if ($module) {
            return $grouped[$module] ?? [];
        }

        return $grouped;
    }
}

