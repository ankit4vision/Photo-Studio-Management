<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'module',
        'submodule',
        'type',
        'is_active',
        'is_deleted',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'is_deleted' => 'boolean',
    ];

    /**
     * Get the roles that have this permission.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_permission');
    }

    /**
     * Scope a query to only include active permissions.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->where('is_deleted', false);
    }

    /**
     * Scope a query to only include non-deleted permissions.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeNotDeleted($query)
    {
        return $query->where('is_deleted', false);
    }

    /**
     * Soft delete the permission.
     *
     * @return bool
     */
    public function softDelete()
    {
        return $this->update(['is_deleted' => true]);
    }

    /**
     * Restore the permission.
     *
     * @return bool
     */
    public function restore()
    {
        return $this->update(['is_deleted' => false]);
    }

    /**
     * Toggle the active status.
     *
     * @return bool
     */
    public function toggleActive()
    {
        return $this->update(['is_active' => !$this->is_active]);
    }
}

