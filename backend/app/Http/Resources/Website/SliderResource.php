<?php

namespace App\Http\Resources\Website;

use App\Http\Resources\Website\Concerns\HasStorageUrl;
use Illuminate\Http\Resources\Json\JsonResource;

class SliderResource extends JsonResource
{
    use HasStorageUrl;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'image_path' => $this->image_path, // Keep original path
            'image_url' => $this->getStorageUrl($this->image_path), // Add full URL for frontend
            'title' => $this->title,
            'description' => $this->description,
            'alt_text' => $this->alt_text,
            'order' => $this->order,
            'link_url' => $this->link_url,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

