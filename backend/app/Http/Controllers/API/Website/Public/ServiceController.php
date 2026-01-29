<?php

namespace App\Http\Controllers\API\Website\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Website\ServiceResource;
use App\Models\Website\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of active services (Public - for website frontend).
     * No authentication required.
     */
    public function index(Request $request)
    {
        $query = Service::active()->ordered();

        // For public API, return only active and ordered services
        $services = $query->get();

        return response()->json([
            'success' => true,
            'data' => ServiceResource::collection($services),
        ]);
    }
}

