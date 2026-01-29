<?php

namespace App\Http\Controllers\API\Website;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\PaginatesResults;
use App\Http\Requests\Website\ProjectStoreRequest;
use App\Http\Requests\Website\ProjectUpdateRequest;
use App\Http\Resources\Website\ProjectResource;
use App\Models\Website\Project;
use App\Models\Website\ProjectPhoto;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    use PaginatesResults;

    /**
     * Display a listing of projects (Public - for website).
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

    /**
     * Display a listing of projects (Admin - with pagination and filters).
     */
    public function adminIndex(Request $request)
    {
        $query = Project::query();

        if ($search = $request->input('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($isActive = $request->input('is_active')) {
            $query->where('is_active', filter_var($isActive, FILTER_VALIDATE_BOOLEAN));
        }

        if ($isFeatured = $request->input('is_featured')) {
            $query->where('is_featured', filter_var($isFeatured, FILTER_VALIDATE_BOOLEAN));
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        $pagination = $this->buildPaginator(
            $request,
            $query,
            ['title', 'author', 'order', 'is_featured', 'is_active', 'created_at'],
            ['column' => 'order', 'direction' => 'asc']
        );

        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = $pagination['paginator'];

        $projects = array_map(
            fn (Project $project) => (new ProjectResource($project))->toArray($request),
            $paginator->items()
        );

        return response()->json([
            'success' => true,
            'data' => $projects,
            'meta' => $this->paginationMeta($paginator, $pagination['sortBy'], $pagination['sortDirection']),
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(ProjectStoreRequest $request)
    {
        $validated = $request->validated();
        $photos = $validated['photos'] ?? [];
        unset($validated['photos']);

        $project = Project::create($validated);

        // Create photos if provided
        if (!empty($photos)) {
            foreach ($photos as $photoData) {
                ProjectPhoto::create([
                    'project_id' => $project->id,
                    'image_path' => $photoData['image_path'],
                    'order' => $photoData['order'] ?? 0,
                ]);
            }
        }

        $project->load('photos');

        return (new ProjectResource($project))
            ->additional([
                'success' => true,
                'message' => 'Project created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project)
    {
        // Load photos relationship for detail page
        $project->load('photos');
        
        return (new ProjectResource($project))
            ->additional([
                'success' => true,
                'message' => 'Project retrieved successfully.',
            ]);
    }

    /**
     * Update the specified project.
     */
    public function update(ProjectUpdateRequest $request, Project $project)
    {
        $validated = $request->validated();
        $photos = $validated['photos'] ?? null;
        unset($validated['photos']);

        $project->update($validated);

        // Update photos if provided
        if ($photos !== null) {
            // Get existing photo IDs
            $existingPhotoIds = collect($photos)->pluck('id')->filter()->toArray();
            
            // Delete photos that are not in the new list
            $project->photos()->whereNotIn('id', $existingPhotoIds)->delete();

            // Update or create photos
            foreach ($photos as $photoData) {
                if (isset($photoData['id']) && $photoData['id']) {
                    // Update existing photo
                    $photo = ProjectPhoto::find($photoData['id']);
                    if ($photo && $photo->project_id === $project->id) {
                        $photo->update([
                            'image_path' => $photoData['image_path'],
                            'order' => $photoData['order'] ?? $photo->order,
                        ]);
                    }
                } else {
                    // Create new photo
                    ProjectPhoto::create([
                        'project_id' => $project->id,
                        'image_path' => $photoData['image_path'],
                        'order' => $photoData['order'] ?? 0,
                    ]);
                }
            }
        }

        $project->load('photos');

        return (new ProjectResource($project))
            ->additional([
                'success' => true,
                'message' => 'Project updated successfully.',
            ]);
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully.',
        ]);
    }
}

