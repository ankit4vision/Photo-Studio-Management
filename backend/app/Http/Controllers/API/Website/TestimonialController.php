<?php

namespace App\Http\Controllers\API\Website;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\PaginatesResults;
use App\Http\Requests\Website\TestimonialStoreRequest;
use App\Http\Requests\Website\TestimonialUpdateRequest;
use App\Http\Resources\Website\TestimonialResource;
use App\Models\Website\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    use PaginatesResults;

    /**
     * Display a listing of testimonials (Public - for website).
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

    /**
     * Display a listing of testimonials (Admin - with pagination and filters).
     */
    public function adminIndex(Request $request)
    {
        $query = Testimonial::query();

        if ($search = $request->input('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('customer_name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('testimonial_text', 'like', "%{$search}%");
            });
        }

        if ($isActive = $request->input('is_active')) {
            $query->where('is_active', filter_var($isActive, FILTER_VALIDATE_BOOLEAN));
        }

        if ($isFeatured = $request->input('is_featured')) {
            $query->where('is_featured', filter_var($isFeatured, FILTER_VALIDATE_BOOLEAN));
        }

        $pagination = $this->buildPaginator(
            $request,
            $query,
            ['customer_name', 'location', 'rating', 'order', 'is_featured', 'is_active', 'created_at'],
            ['column' => 'order', 'direction' => 'asc']
        );

        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = $pagination['paginator'];

        $testimonials = array_map(
            fn (Testimonial $testimonial) => (new TestimonialResource($testimonial))->toArray($request),
            $paginator->items()
        );

        return response()->json([
            'success' => true,
            'data' => $testimonials,
            'meta' => $this->paginationMeta($paginator, $pagination['sortBy'], $pagination['sortDirection']),
        ]);
    }

    /**
     * Store a newly created testimonial.
     */
    public function store(TestimonialStoreRequest $request)
    {
        $testimonial = Testimonial::create($request->validated());

        return (new TestimonialResource($testimonial))
            ->additional([
                'success' => true,
                'message' => 'Testimonial created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified testimonial.
     */
    public function show(Testimonial $testimonial)
    {
        return (new TestimonialResource($testimonial))
            ->additional([
                'success' => true,
                'message' => 'Testimonial retrieved successfully.',
            ]);
    }

    /**
     * Update the specified testimonial.
     */
    public function update(TestimonialUpdateRequest $request, Testimonial $testimonial)
    {
        $testimonial->update($request->validated());

        return (new TestimonialResource($testimonial))
            ->additional([
                'success' => true,
                'message' => 'Testimonial updated successfully.',
            ]);
    }

    /**
     * Remove the specified testimonial.
     */
    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return response()->json([
            'success' => true,
            'message' => 'Testimonial deleted successfully.',
        ]);
    }
}

