<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resource extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'filename',
        'original_filename',
        'file_path',
        'file_url',
        'file_size',
        'mime_type',
        'file_extension',
        'location',
        'storage_disk',
        'module',
        'folder',
        'resource_type',
        'related_table',
        'related_id',
        'title',
        'description',
        'alt_text',
        'is_primary',
        'sort_order',
        'visibility',
        'status',
        'uploaded_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'file_size' => 'integer',
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['file_url'];

    /**
     * Get the user who uploaded this resource.
     */
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Dynamic relationship based on related_table.
     * Returns the related model instance.
     *
     * @return Model|null
     */
    public function related()
    {
        $table = $this->related_table;
        $id = $this->related_id;

        // Map table names to model classes
        $modelMap = [
            'users' => User::class,
            'customers' => Customer::class,
            'orders' => Order::class,
            'packages' => Package::class,
            'branches' => Branch::class,
            'payments' => Payment::class,
            'settings' => Setting::class,
        ];

        if (isset($modelMap[$table])) {
            return $modelMap[$table]::find($id);
        }

        return null;
    }

    /**
     * Scope: Filter by related table.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $table
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForTable($query, $table)
    {
        return $query->where('related_table', $table);
    }

    /**
     * Scope: Filter by related table and ID.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $table
     * @param int $id
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForRecord($query, $table, $id)
    {
        return $query->where('related_table', $table)->where('related_id', $id);
    }

    /**
     * Scope: Filter by location (local or s3).
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $location
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByLocation($query, $location)
    {
        return $query->where('location', $location);
    }

    /**
     * Scope: Filter by module and folder.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $module
     * @param string $folder
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByModuleFolder($query, $module, $folder)
    {
        return $query->where('module', $module)->where('folder', $folder);
    }

    /**
     * Scope: Get only primary resources.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Scope: Get only active resources.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Get the file URL dynamically based on current storage settings.
     * This ensures URLs are always correct even if bucket/region changes.
     *
     * @return string|null
     */
    public function getFileUrlAttribute($value)
    {
        // If file_url is already set in database (for backward compatibility), return it
        // But for new records, we'll generate dynamically
        if ($value !== null && $value !== '') {
            return $value;
        }
        
        // Generate URL dynamically from file_path
        $fileUploadService = app(\App\Services\FileUploadService::class);
        
        // Get raw file_path from attributes (avoid accessor recursion)
        $path = $this->attributes['file_path'] ?? null;
        if (!$path) {
            return null;
        }
        
        // For S3, prepend s3:// prefix for FileUploadService compatibility
        if ($this->attributes['location'] === 's3') {
            $path = 's3://' . ltrim($path, '/');
        } else {
            // For local, prepend /uploads/ for FileUploadService compatibility
            $path = '/uploads/' . ltrim($path, '/');
        }
        
        return $fileUploadService->getFileUrl($path);
    }

    /**
     * Convert resource to image object format for API responses.
     * URL is generated dynamically to ensure it's always correct.
     *
     * @return array|null
     */
    public function toImageObject()
    {
        return [
            'id' => $this->id,
            'url' => $this->file_url, // Uses accessor - generated dynamically
            'path' => $this->file_path, // Relative path only
            'location' => $this->location,
            'filename' => $this->filename,
            'original_filename' => $this->original_filename,
            'mime_type' => $this->mime_type,
            'file_extension' => $this->file_extension,
            'file_size' => $this->file_size,
            'is_primary' => $this->is_primary,
            'sort_order' => $this->sort_order,
            'visibility' => $this->visibility,
            'status' => $this->status,
            'title' => $this->title,
            'alt_text' => $this->alt_text,
        ];
    }
}

