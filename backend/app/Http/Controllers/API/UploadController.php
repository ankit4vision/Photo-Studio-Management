<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadFileRequest;
use App\Services\FileUploadService;

class UploadController extends Controller
{
    protected FileUploadService $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Handle generic file uploads for any module/folder combination.
     * Optionally creates Resource record if related_table and related_id are provided.
     */
    public function store(UploadFileRequest $request)
    {
        $data = $request->validated();

        $filePayload = $request->file('file') ?? $data['file_base64'] ?? null;
        $module = $data['module'];
        $folder = $data['folder'];
        $filename = $data['filename'] ?? null;
        $visibility = $data['visibility'] ?? 'public';
        $existingPath = $data['existing_path'] ?? null;

        $uploadResult = $existingPath
            ? $this->fileUploadService->replaceFile($existingPath, $filePayload, $folder, $filename, $visibility, $module)
            : $this->fileUploadService->uploadFile($filePayload, $folder, $filename, $visibility, $module);

        $responseData = $uploadResult;

        // Optionally create Resource record if related_table and related_id are provided
        if (!empty($data['related_table']) && !empty($data['related_id'])) {
            $resource = $this->fileUploadService->createResource(
                $uploadResult,
                $data['related_table'],
                $data['related_id'],
                [
                    'file' => $filePayload,
                    'resource_type' => $data['resource_type'] ?? null,
                    'is_primary' => $data['is_primary'] ?? false,
                    'visibility' => $visibility,
                ]
            );

            if ($resource) {
                $responseData['resource_id'] = $resource->id;
                $responseData['resource'] = $resource->toImageObject();
            }
        }

        return response()->json([
            'success' => true,
            'data' => $responseData,
        ]);
    }
}


