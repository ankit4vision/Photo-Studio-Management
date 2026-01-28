<?php

namespace App\Http\Controllers\API\Website;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\PaginatesResults;
use App\Http\Requests\Website\GalleryVideoStoreRequest;
use App\Http\Requests\Website\GalleryVideoUpdateRequest;
use App\Http\Resources\Website\GalleryVideoResource;
use App\Models\Website\GalleryVideo;
use Illuminate\Http\Request;

class GalleryVideoController extends Controller
{
    use PaginatesResults;

    /**
     * Display a listing of gallery videos (Public - for website).
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

    /**
     * Display a listing of gallery videos (Admin - with pagination and filters).
     */
    public function adminIndex(Request $request)
    {
        $query = GalleryVideo::query();

        if ($search = $request->input('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($isActive = $request->input('is_active')) {
            $query->where('is_active', filter_var($isActive, FILTER_VALIDATE_BOOLEAN));
        }

        if ($platform = $request->input('platform')) {
            $query->where('platform', $platform);
        }

        $pagination = $this->buildPaginator(
            $request,
            $query,
            ['title', 'platform', 'order', 'is_active', 'created_at'],
            ['column' => 'order', 'direction' => 'asc']
        );

        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = $pagination['paginator'];

        $videos = array_map(
            fn (GalleryVideo $video) => (new GalleryVideoResource($video))->toArray($request),
            $paginator->items()
        );

        return response()->json([
            'success' => true,
            'data' => $videos,
            'meta' => $this->paginationMeta($paginator, $pagination['sortBy'], $pagination['sortDirection']),
        ]);
    }

    /**
     * Store a newly created gallery video.
     */
    public function store(GalleryVideoStoreRequest $request)
    {
        $video = GalleryVideo::create($request->validated());

        return (new GalleryVideoResource($video))
            ->additional([
                'success' => true,
                'message' => 'Gallery video created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified gallery video.
     */
    public function show(GalleryVideo $galleryVideo)
    {
        return (new GalleryVideoResource($galleryVideo))
            ->additional([
                'success' => true,
                'message' => 'Gallery video retrieved successfully.',
            ]);
    }

    /**
     * Update the specified gallery video.
     */
    public function update(GalleryVideoUpdateRequest $request, GalleryVideo $galleryVideo)
    {
        $galleryVideo->update($request->validated());

        return (new GalleryVideoResource($galleryVideo))
            ->additional([
                'success' => true,
                'message' => 'Gallery video updated successfully.',
            ]);
    }

    /**
     * Remove the specified gallery video.
     */
    public function destroy(GalleryVideo $galleryVideo)
    {
        $galleryVideo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gallery video deleted successfully.',
        ]);
    }
}

