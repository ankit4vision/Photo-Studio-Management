<?php

namespace App\Http\Controllers\API\Website;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\PaginatesResults;
use App\Http\Requests\Website\SliderStoreRequest;
use App\Http\Requests\Website\SliderUpdateRequest;
use App\Http\Resources\Website\SliderResource;
use App\Models\Website\Slider;
use Illuminate\Http\Request;

class SliderController extends Controller
{
    use PaginatesResults;

    /**
     * Display a listing of sliders (Public - for website).
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

    /**
     * Display a listing of sliders (Admin - with pagination and filters).
     */
    public function adminIndex(Request $request)
    {
        $query = Slider::query();

        if ($search = $request->input('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
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

        $sliders = array_map(
            fn (Slider $slider) => (new SliderResource($slider))->toArray($request),
            $paginator->items()
        );

        return response()->json([
            'success' => true,
            'data' => $sliders,
            'meta' => $this->paginationMeta($paginator, $pagination['sortBy'], $pagination['sortDirection']),
        ]);
    }

    /**
     * Store a newly created slider.
     */
    public function store(SliderStoreRequest $request)
    {
        $slider = Slider::create($request->validated());

        return (new SliderResource($slider))
            ->additional([
                'success' => true,
                'message' => 'Slider created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified slider.
     */
    public function show(Slider $slider)
    {
        return (new SliderResource($slider))
            ->additional([
                'success' => true,
                'message' => 'Slider retrieved successfully.',
            ]);
    }

    /**
     * Update the specified slider.
     */
    public function update(SliderUpdateRequest $request, Slider $slider)
    {
        $slider->update($request->validated());

        return (new SliderResource($slider))
            ->additional([
                'success' => true,
                'message' => 'Slider updated successfully.',
            ]);
    }

    /**
     * Remove the specified slider.
     */
    public function destroy(Slider $slider)
    {
        $slider->delete();

        return response()->json([
            'success' => true,
            'message' => 'Slider deleted successfully.',
        ]);
    }

    /**
     * Reorder sliders.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'sliders' => 'required|array',
            'sliders.*.id' => 'required|exists:website_sliders,id',
            'sliders.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->input('sliders') as $item) {
            Slider::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Sliders reordered successfully.',
        ]);
    }
}

