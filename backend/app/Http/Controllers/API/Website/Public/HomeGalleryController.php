<?php

namespace App\Http\Controllers\API\Website\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Website\HomeGalleryResource;
use App\Models\Website\HomeGallery;
use Illuminate\Http\Request;

class HomeGalleryController extends Controller
{
    /**
     * Display a listing of active home gallery images (Public - for website frontend).
     * No authentication required.
     */
    public function index(Request $request)
    {
        $query = HomeGallery::active()->ordered();

        $gallery = $query->get();

        return response()->json([
            'success' => true,
            'data' => HomeGalleryResource::collection($gallery),
        ]);
    }
}

