<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UploadFileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'file' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,svg|max:5120',
            'file_base64' => 'nullable|string',
            'module' => 'required|string|max:100',
            'folder' => 'required|string|max:100',
            'visibility' => 'nullable|in:public,private',
            'filename' => 'nullable|string|max:255',
            'existing_path' => 'nullable|string|max:2048',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $hasUploadedFile = $this->hasFile('file');
            $hasBase64 = $this->filled('file_base64');

            if (!$hasUploadedFile && !$hasBase64) {
                $validator->errors()->add('file', 'Either file or file_base64 is required.');
            }

            if ($hasBase64 && !preg_match('/^data:image\/(\w+);base64,/', $this->input('file_base64'))) {
                $validator->errors()->add('file_base64', 'file_base64 must be a valid base64-encoded image data URI.');
            }
        });
    }
}


