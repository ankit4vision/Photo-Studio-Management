<?php

namespace App\Http\Resources\Website;

use App\Http\Resources\Website\Concerns\HasStorageUrl;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeGalleryResource extends JsonResource
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
            'image_path' => $this->image_path,
            'image_url' => $this->getStorageUrl($this->image_path),
            'title' => $this->title,
            'alt_text' => $this->alt_text,
            'order' => $this->order,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

