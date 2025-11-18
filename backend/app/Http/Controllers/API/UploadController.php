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

        return response()->json([
            'success' => true,
            'data' => $uploadResult,
        ]);
    }
}


