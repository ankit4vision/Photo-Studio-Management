<?php

namespace App\Http\Resources\Website;

use App\Http\Resources\Website\Concerns\HasStorageUrl;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
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
            'customer_name' => $this->customer_name,
            'location' => $this->location,
            'testimonial_text' => $this->testimonial_text,
            'rating' => $this->rating,
            'photo_path' => $this->photo_path, // Keep original path
            'photo_url' => $this->getStorageUrl($this->photo_path), // Add full URL for frontend
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

