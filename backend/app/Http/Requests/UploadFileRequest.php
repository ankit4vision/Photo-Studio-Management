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
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert string booleans to actual booleans for FormData compatibility
        if ($this->has('is_primary')) {
            $value = $this->input('is_primary');
            if (is_string($value)) {
                $this->merge([
                    'is_primary' => filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
                ]);
            }
        }
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
            'related_table' => 'nullable|string|max:100',
            'related_id' => 'nullable|integer',
            'resource_type' => 'nullable|string|max:100',
            'is_primary' => 'nullable|boolean',
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


