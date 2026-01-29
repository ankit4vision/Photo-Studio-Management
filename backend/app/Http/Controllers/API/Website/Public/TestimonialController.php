<?php

namespace App\Http\Controllers\API\Website\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Website\TestimonialResource;
use App\Models\Website\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * Display a listing of active testimonials (Public - for website frontend).
     * No authentication required.
     */
    public function index(Request $request)
    {
        $query = Testimonial::active()->ordered();

        // Filter by featured if requested
        if ($request->boolean('featured')) {
            $query->featured();
        }

        $testimonials = $query->get();

        return response()->json([
            'success' => true,
            'data' => TestimonialResource::collection($testimonials),
        ]);
    }
}

