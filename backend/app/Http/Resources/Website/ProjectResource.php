<?php

namespace App\Http\Resources\Website;

use App\Http\Resources\Website\Concerns\HasStorageUrl;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    use HasStorageUrl;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'author' => $this->author,
            'thumbnail_image' => $this->thumbnail_image, // Keep original path
            'thumbnail_image_url' => $this->getStorageUrl($this->thumbnail_image), // Add full URL for frontend
            'hero_image' => $this->hero_image, // Keep original path
            'hero_image_url' => $this->hero_image ? $this->getStorageUrl($this->hero_image) : null, // Add full URL for frontend
            'description' => $this->description,
            'event_date' => $this->event_date?->format('Y-m-d'),
            'location' => $this->location,
            'photographer' => $this->photographer ?? $this->author, // Use photographer if available, else author
            'album_id' => $this->album_id,
            'category' => $this->category,
            'tags' => $this->tags ?? [],
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'photo_count' => $this->relationLoaded('photos') 
                ? ($this->photos ? $this->photos->count() : 0)
                : 0,
            'photos' => $this->relationLoaded('photos') 
                ? ($this->photos ? \App\Http\Resources\Website\ProjectPhotoResource::collection($this->photos) : [])
                : [],
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

