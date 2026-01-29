<?php

namespace App\Http\Controllers\API\Website;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Upload a CMS image file and return its storage path and public URL.
     *
     * This follows the same pattern as avatar/business logo uploads and stores
     * files under storage/app/public/website/cms/{folder}.
     *
     * Request:
     *  - file   : required image file (jpeg, jpg, png, webp)
     *  - folder : optional sub-folder (slider, gallery, albums, etc.)
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120', // 5MB max
            'folder' => 'nullable|string|max:100',
        ]);

        $file = $request->file('file');
        $folder = trim($request->input('folder', 'general'), '/');

        // Base folder for all CMS uploads
        $baseFolder = 'website/cms';
        $storageFolder = $folder ? $baseFolder . '/' . $folder : $baseFolder;

        $filename = 'media_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

        // Store on public disk so it's accessible via /storage URL
        $path = $file->storeAs('public/' . $storageFolder, $filename);

        // Convert to relative path (without "public/" prefix)
        $relativePath = str_replace('public/', '', $path);

        return response()->json([
            'success' => true,
            'message' => 'Image uploaded successfully',
            'data' => [
                'path' => $relativePath,
                'url' => $this->getStorageUrl($relativePath),
            ],
        ]);
    }

    /**
     * Generate storage URL with correct backend path.
     * Mirrors the logic used in SettingController for business_logo.
     *
     * @param string $relativePath Relative path from storage/app/public (e.g., 'website/cms/slider/file.jpg')
     * @return string
     */
    protected function getStorageUrl(string $relativePath): string
    {
        $appUrl = rtrim(config('app.url'), '/');

        // Extract domain from APP_URL
        $parsedUrl = parse_url($appUrl);
        $scheme = $parsedUrl['scheme'] ?? 'https';
        $host = $parsedUrl['host'] ?? 'localhost';
        $domain = $scheme . '://' . $host;

        // If APP_URL already includes /api, just append /storage
        if (str_contains($appUrl, '/api')) {
            return $appUrl . '/storage/' . $relativePath;
        }

        // If APP_URL ends with /admin, add /api before /storage
        if (str_ends_with($appUrl, '/admin')) {
            return $domain . '/admin/api/storage/' . $relativePath;
        }

        // If APP_URL contains /admin but doesn't end with it, inspect path
        if (str_contains($appUrl, '/admin')) {
            $path = $parsedUrl['path'] ?? '';
            if ($path === '/admin') {
                return $domain . '/admin/api/storage/' . $relativePath;
            }

            // Fallback: use APP_URL as-is
            return $appUrl . '/storage/' . $relativePath;
        }

        // Default: root installation, ensure we don't duplicate /api
        $base = preg_replace('#/api/?$#', '', $appUrl);

        return $base . '/storage/' . $relativePath;
    }
}


