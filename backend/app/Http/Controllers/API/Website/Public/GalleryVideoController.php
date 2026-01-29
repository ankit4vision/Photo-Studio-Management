<?php

namespace App\Http\Controllers\API\Website\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Website\GalleryVideoResource;
use App\Models\Website\GalleryVideo;
use Illuminate\Http\Request;

class GalleryVideoController extends Controller
{
    /**
     * Display a listing of active gallery videos (Public - for website frontend).
     * No authentication required.
     */
    public function index(Request $request)
    {
        $query = GalleryVideo::active()->ordered();

        $videos = $query->get();

        return response()->json([
            'success' => true,
            'data' => GalleryVideoResource::collection($videos),
        ]);
    }
}

