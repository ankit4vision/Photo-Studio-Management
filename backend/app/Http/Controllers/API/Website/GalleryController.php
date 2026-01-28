<?php

namespace App\Http\Controllers\API\Website;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\PaginatesResults;
use App\Http\Requests\Website\GalleryStoreRequest;
use App\Http\Requests\Website\GalleryUpdateRequest;
use App\Http\Resources\Website\GalleryResource;
use App\Models\Website\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    use PaginatesResults;

    /**
     * Display a listing of gallery images (Public - for website).
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
                'per_page' => $gallery->perPage(),
                'total' => $gallery->total(),
                'total_pages' => $gallery->lastPage(),
            ],
        ]);
    }

    /**
     * Display a listing of gallery images (Admin - with pagination and filters).
     */
    public function adminIndex(Request $request)
    {
        $query = Gallery::query();

        if ($search = $request->input('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($isActive = $request->input('is_active')) {
            $query->where('is_active', filter_var($isActive, FILTER_VALIDATE_BOOLEAN));
        }

        if ($category = $request->input('category')) {
            $query->category($category);
        }

        $pagination = $this->buildPaginator(
            $request,
            $query,
            ['title', 'category', 'order', 'is_active', 'created_at'],
            ['column' => 'order', 'direction' => 'asc']
        );

        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = $pagination['paginator'];

        $gallery = array_map(
            fn (Gallery $item) => (new GalleryResource($item))->toArray($request),
            $paginator->items()
        );

        return response()->json([
            'success' => true,
            'data' => $gallery,
            'meta' => $this->paginationMeta($paginator, $pagination['sortBy'], $pagination['sortDirection']),
        ]);
    }

    /**
     * Store a newly created gallery image.
     */
    public function store(GalleryStoreRequest $request)
    {
        $gallery = Gallery::create($request->validated());

        return (new GalleryResource($gallery))
            ->additional([
                'success' => true,
                'message' => 'Gallery image created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified gallery image.
     */
    public function show(Gallery $gallery)
    {
        return (new GalleryResource($gallery))
            ->additional([
                'success' => true,
                'message' => 'Gallery image retrieved successfully.',
            ]);
    }

    /**
     * Update the specified gallery image.
     */
    public function update(GalleryUpdateRequest $request, Gallery $gallery)
    {
        $gallery->update($request->validated());

        return (new GalleryResource($gallery))
            ->additional([
                'success' => true,
                'message' => 'Gallery image updated successfully.',
            ]);
    }

    /**
     * Remove the specified gallery image.
     */
    public function destroy(Gallery $gallery)
    {
        $gallery->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gallery image deleted successfully.',
        ]);
    }
}

