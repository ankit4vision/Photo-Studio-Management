<?php

namespace App\Http\Controllers\API\Website\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Website\GalleryResource;
use App\Models\Website\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    /**
     * Display a listing of active gallery images (Public - for website frontend).
     * No authentication required.
     */
    public function index(Request $request)
    {
        $query = Gallery::active()->ordered();

        // Filter by category if provided
        if ($category = $request->input('category')) {
            $query->category($category);
        }

        // Pagination for public API
        $perPage = $request->input('per_page', 20);
        $page = $request->input('page', 1);
        
        $gallery = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => GalleryResource::collection($gallery->items()),
            'meta' => [
                'current_page' => $gallery->currentPage(),
                'last_page' => $gallery->lastPage(),
                'per_page' => $gallery->perPage(),
                'total' => $gallery->total(),
            ],
        ]);
    }
}

