<?php

namespace App\Http\Controllers\API\Website\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Website\ProjectResource;
use App\Models\Website\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of active projects (Public - for website frontend).
     * No authentication required.
     */
    public function index(Request $request)
    {
        $query = Project::active()->ordered();

        // Filter by featured if requested
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Filter by category if provided
        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        $projects = $query->get();

        return response()->json([
            'success' => true,
            'data' => ProjectResource::collection($projects),
        ]);
    }
}

