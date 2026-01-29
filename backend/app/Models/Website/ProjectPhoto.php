<?php

namespace App\Models\Website;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectPhoto extends Model
{
    use HasFactory;

    protected $table = 'website_project_photos';

    protected $fillable = [
        'project_id',
        'image_path',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    /**
     * Get the project that owns the photo.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
