<?php

namespace App\Http\Controllers\API\Website\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Website\AlbumResource;
use App\Models\Website\Album;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
    /**
     * Display a listing of active albums (Public - for website frontend).
     * No authentication required.
     */
    public function index(Request $request)
    {
        $query = Album::active()->ordered();

        // Filter by featured if requested
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Filter by category if provided
        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        $albums = $query->get();

        return response()->json([
            'success' => true,
            'data' => AlbumResource::collection($albums),
        ]);
    }
}

