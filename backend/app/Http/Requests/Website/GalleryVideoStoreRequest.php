<?php

namespace App\Http\Requests\Website;

use Illuminate\Foundation\Http\FormRequest;

class GalleryVideoStoreRequest extends FormRequest
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
            'video_url' => 'required|string|max:500',
            'platform' => 'nullable|in:youtube,vimeo',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'thumbnail_path' => 'nullable|string|max:500',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ];
    }
}

