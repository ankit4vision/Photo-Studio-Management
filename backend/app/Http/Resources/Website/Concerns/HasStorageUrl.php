<?php

namespace App\Http\Resources\Website\Concerns;

trait HasStorageUrl
{
    /**
     * Generate storage URL with correct backend path.
     * Handles both storage paths and frontend asset paths.
     * Mirrors the logic used in MediaController for CMS images.
     *
     * @param string|null $relativePath 
     *   - Storage path: 'website/cms/slider/file.jpg' (relative from storage/app/public)
     *   - Frontend asset: '/assets/img/slider/37.jpg' (relative from website public folder)
     * @return string|null
     */
    protected function getStorageUrl(?string $relativePath): ?string
    {
        // Handle null, empty string, or whitespace-only strings
        if (!$relativePath || trim($relativePath) === '') {
            return null;
        }
        
        // Trim whitespace
        $relativePath = trim($relativePath);

        // If it's already a full URL, return as is
        if (str_starts_with($relativePath, 'http://') || str_starts_with($relativePath, 'https://')) {
            return $relativePath;
        }

        // Handle frontend asset paths (starting with /assets/)
        if (str_starts_with($relativePath, '/assets/')) {
            // Get website URL from config (FRONTEND_URL)
            // Note: FRONTEND_URL should point to the website frontend (port 5173), not admin panel
            $websiteUrl = config('app.frontend_url');
            
            // If FRONTEND_URL is not set or points to admin panel (port 3000), use default website port
            if (!$websiteUrl || str_contains($websiteUrl, ':3000')) {
                // Derive from APP_URL and use website frontend port (5173 for Vite dev server)
                $appUrl = rtrim(config('app.url'), '/');
                $parsedUrl = parse_url($appUrl);
                $scheme = $parsedUrl['scheme'] ?? 'http';
                $host = $parsedUrl['host'] ?? 'localhost';
                
                // For development, website typically runs on port 5173 (Vite)
                // Admin panel runs on port 3000, but we need website frontend
                if ($host === 'localhost' || $host === '127.0.0.1') {
                    $websiteUrl = $scheme . '://' . $host . ':5173';
                } else {
                    // Production: same domain, different path or subdomain
                    $path = $parsedUrl['path'] ?? '';
                    $path = preg_replace('#/(admin|api)/?$#', '', $path);
                    $websiteUrl = $scheme . '://' . $host . $path;
                }
            }
            
            return rtrim($websiteUrl, '/') . $relativePath;
        }

        // Handle storage paths (relative from storage/app/public)
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

