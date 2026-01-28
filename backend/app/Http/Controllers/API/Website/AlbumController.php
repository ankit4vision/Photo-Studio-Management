<?php

namespace App\Http\Controllers\API\Website;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\PaginatesResults;
use App\Http\Requests\Website\AlbumStoreRequest;
use App\Http\Requests\Website\AlbumUpdateRequest;
use App\Http\Resources\Website\AlbumResource;
use App\Models\Website\Album;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
    use PaginatesResults;

    /**
     * Display a listing of albums (Public - for website).
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

    /**
     * Display a listing of albums (Admin - with pagination and filters).
     */
    public function adminIndex(Request $request)
    {
        $query = Album::query();

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

        if ($isFeatured = $request->input('is_featured')) {
            $query->where('is_featured', filter_var($isFeatured, FILTER_VALIDATE_BOOLEAN));
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        $pagination = $this->buildPaginator(
            $request,
            $query,
            ['title', 'category', 'order', 'is_featured', 'is_active', 'created_at'],
            ['column' => 'order', 'direction' => 'asc']
        );

        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = $pagination['paginator'];

        $albums = array_map(
            fn (Album $album) => (new AlbumResource($album))->toArray($request),
            $paginator->items()
        );

        return response()->json([
            'success' => true,
            'data' => $albums,
            'meta' => $this->paginationMeta($paginator, $pagination['sortBy'], $pagination['sortDirection']),
        ]);
    }

    /**
     * Store a newly created album.
     */
    public function store(AlbumStoreRequest $request)
    {
        $album = Album::create($request->validated());

        return (new AlbumResource($album))
            ->additional([
                'success' => true,
                'message' => 'Album created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified album.
     */
    public function show(Album $album)
    {
        return (new AlbumResource($album))
            ->additional([
                'success' => true,
                'message' => 'Album retrieved successfully.',
            ]);
    }

    /**
     * Update the specified album.
     */
    public function update(AlbumUpdateRequest $request, Album $album)
    {
        $album->update($request->validated());

        return (new AlbumResource($album))
            ->additional([
                'success' => true,
                'message' => 'Album updated successfully.',
            ]);
    }

    /**
     * Remove the specified album.
     */
    public function destroy(Album $album)
    {
        $album->delete();

        return response()->json([
            'success' => true,
            'message' => 'Album deleted successfully.',
        ]);
    }
}

