<?php

namespace App\Http\Requests\Website;

use Illuminate\Foundation\Http\FormRequest;

class ProjectUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'author' => 'nullable|string|max:255',
            'thumbnail_image' => 'sometimes|string|max:500',
            'hero_image' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'event_date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
            'photographer' => 'nullable|string|max:255',
            'album_id' => 'nullable|integer|exists:website_albums,id',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:100',
            'photos' => 'nullable|array|max:12',
            'photos.*.id' => 'nullable|integer|exists:website_project_photos,id',
            'photos.*.image_path' => 'required|string|max:500',
            'photos.*.order' => 'nullable|integer|min:0',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ];
    }
}

