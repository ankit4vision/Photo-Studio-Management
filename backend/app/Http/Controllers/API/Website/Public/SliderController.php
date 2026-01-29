<?php

namespace App\Http\Controllers\API\Website\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Website\SliderResource;
use App\Models\Website\Slider;
use Illuminate\Http\Request;

class SliderController extends Controller
{
    /**
     * Display a listing of active sliders (Public - for website frontend).
     * No authentication required.
     */
    public function index(Request $request)
    {
        $query = Slider::active()->ordered();

        // For public API, return only active and ordered sliders
        $sliders = $query->get();

        return response()->json([
            'success' => true,
            'data' => SliderResource::collection($sliders),
        ]);
    }
}

