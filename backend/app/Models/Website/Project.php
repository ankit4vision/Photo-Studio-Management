<?php

namespace App\Models\Website;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'website_projects';

    protected $fillable = [
        'title',
        'author',
        'thumbnail_image',
        'hero_image',
        'description',
        'event_date',
        'location',
        'photographer',
        'album_id',
        'category',
        'tags',
        'is_featured',
        'is_active',
        'order',
    ];

    protected $casts = [
        'tags' => 'array',
        'event_date' => 'date',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
        'album_id' => 'integer',
    ];

    /**
     * Get the photos for the project.
     */
    public function photos()
    {
        return $this->hasMany(ProjectPhoto::class)->orderBy('order', 'asc');
    }

    /**
     * Scope a query to only include active projects.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include featured projects.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to order by display order.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')->orderBy('id', 'asc');
    }
}

