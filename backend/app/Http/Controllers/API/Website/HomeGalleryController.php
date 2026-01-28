<?php

namespace App\Http\Controllers\API\Website;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\PaginatesResults;
use App\Http\Requests\Website\HomeGalleryStoreRequest;
use App\Http\Requests\Website\HomeGalleryUpdateRequest;
use App\Http\Resources\Website\HomeGalleryResource;
use App\Models\Website\HomeGallery;
use Illuminate\Http\Request;

class HomeGalleryController extends Controller
{
    use PaginatesResults;

    /**
     * Display a listing of home gallery images (Public - for website).
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

    /**
     * Display a listing of home gallery images (Admin - with pagination and filters).
     */
    public function adminIndex(Request $request)
    {
        $query = HomeGallery::query();

        if ($search = $request->input('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%");
            });
        }

        if ($isActive = $request->input('is_active')) {
            $query->where('is_active', filter_var($isActive, FILTER_VALIDATE_BOOLEAN));
        }

        $pagination = $this->buildPaginator(
            $request,
            $query,
            ['title', 'order', 'is_active', 'created_at'],
            ['column' => 'order', 'direction' => 'asc']
        );

        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = $pagination['paginator'];

        $gallery = array_map(
            fn (HomeGallery $item) => (new HomeGalleryResource($item))->toArray($request),
            $paginator->items()
        );

        return response()->json([
            'success' => true,
            'data' => $gallery,
            'meta' => $this->paginationMeta($paginator, $pagination['sortBy'], $pagination['sortDirection']),
        ]);
    }

    /**
     * Store a newly created home gallery image.
     */
    public function store(HomeGalleryStoreRequest $request)
    {
        $gallery = HomeGallery::create($request->validated());

        return (new HomeGalleryResource($gallery))
            ->additional([
                'success' => true,
                'message' => 'Gallery image created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified home gallery image.
     */
    public function show(HomeGallery $homeGallery)
    {
        return (new HomeGalleryResource($homeGallery))
            ->additional([
                'success' => true,
                'message' => 'Gallery image retrieved successfully.',
            ]);
    }

    /**
     * Update the specified home gallery image.
     */
    public function update(HomeGalleryUpdateRequest $request, HomeGallery $homeGallery)
    {
        $homeGallery->update($request->validated());

        return (new HomeGalleryResource($homeGallery))
            ->additional([
                'success' => true,
                'message' => 'Gallery image updated successfully.',
            ]);
    }

    /**
     * Remove the specified home gallery image.
     */
    public function destroy(HomeGallery $homeGallery)
    {
        $homeGallery->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gallery image deleted successfully.',
        ]);
    }
}

