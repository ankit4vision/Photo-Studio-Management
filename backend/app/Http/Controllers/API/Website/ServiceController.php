<?php

namespace App\Http\Controllers\API\Website;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\PaginatesResults;
use App\Http\Requests\Website\ServiceStoreRequest;
use App\Http\Requests\Website\ServiceUpdateRequest;
use App\Http\Resources\Website\ServiceResource;
use App\Models\Website\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    use PaginatesResults;

    /**
     * Display a listing of services (Public - for website).
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

    /**
     * Display a listing of services (Admin - with pagination and filters).
     */
    public function adminIndex(Request $request)
    {
        $query = Service::query();

        if ($search = $request->input('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
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

        $services = array_map(
            fn (Service $service) => (new ServiceResource($service))->toArray($request),
            $paginator->items()
        );

        return response()->json([
            'success' => true,
            'data' => $services,
            'meta' => $this->paginationMeta($paginator, $pagination['sortBy'], $pagination['sortDirection']),
        ]);
    }

    /**
     * Store a newly created service.
     */
    public function store(ServiceStoreRequest $request)
    {
        $service = Service::create($request->validated());

        return (new ServiceResource($service))
            ->additional([
                'success' => true,
                'message' => 'Service created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified service.
     */
    public function show(Service $service)
    {
        return (new ServiceResource($service))
            ->additional([
                'success' => true,
                'message' => 'Service retrieved successfully.',
            ]);
    }

    /**
     * Update the specified service.
     */
    public function update(ServiceUpdateRequest $request, Service $service)
    {
        $service->update($request->validated());

        return (new ServiceResource($service))
            ->additional([
                'success' => true,
                'message' => 'Service updated successfully.',
            ]);
    }

    /**
     * Remove the specified service.
     */
    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully.',
        ]);
    }

    /**
     * Reorder services.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'services' => 'required|array',
            'services.*.id' => 'required|exists:website_services,id',
            'services.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->services as $item) {
            Service::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Services reordered successfully.',
        ]);
    }
}

