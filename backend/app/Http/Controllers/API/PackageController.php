<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\PaginatesResults;
use App\Http\Requests\PackageStoreRequest;
use App\Http\Requests\PackageUpdateRequest;
use App\Http\Resources\PackageResource;
use App\Models\Package;
use App\Models\Setting;
use App\Services\PdfExportService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PackageController extends Controller
{
    use PaginatesResults;

    /**
     * Display a listing of packages.
     */
    public function index(Request $request)
    {
        $query = Package::query();

        if ($search = $request->input('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('package_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('package_type', 'like', "%{$search}%");
            });
        }

        if ($packageType = $request->input('package_type')) {
            $query->where('package_type', $packageType);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Filter by price range
        if ($minPrice = $request->input('min_price')) {
            $query->where('default_price', '>=', $minPrice);
        }

        if ($maxPrice = $request->input('max_price')) {
            $query->where('default_price', '<=', $maxPrice);
        }

        $pagination = $this->buildPaginator(
            $request,
            $query,
            ['package_name', 'package_type', 'default_price', 'status', 'created_at'],
            ['column' => 'created_at', 'direction' => 'desc']
        );

        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = $pagination['paginator'];

        $packages = array_map(
            fn (Package $package) => (new PackageResource($package))->toArray($request),
            $paginator->items()
        );

        return response()->json([
            'success' => true,
            'data' => $packages,
            'meta' => $this->paginationMeta($paginator, $pagination['sortBy'], $pagination['sortDirection']),
        ]);
    }

    /**
     * Store a newly created package.
     */
    public function store(PackageStoreRequest $request)
    {
        $package = Package::create($request->validated());

        return (new PackageResource($package))
            ->additional([
                'success' => true,
                'message' => 'Package created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified package.
     */
    public function show(Package $package)
    {
        return (new PackageResource($package))
            ->additional([
                'success' => true,
                'message' => 'Package retrieved successfully.',
            ]);
    }

    /**
     * Update the specified package.
     */
    public function update(PackageUpdateRequest $request, Package $package)
    {
        $package->update($request->validated());

        return (new PackageResource($package))
            ->additional([
                'success' => true,
                'message' => 'Package updated successfully.',
            ]);
    }

    /**
     * Remove the specified package.
     */
    public function destroy(Package $package)
    {
        $package->delete();

        return response()->json([
            'success' => true,
            'message' => 'Package deleted successfully.',
        ]);
    }

    /**
     * Export a single package to PDF.
     */
    public function exportPdf(Package $package, PdfExportService $pdfService)
    {
        $settings = Setting::businessInfo();

        $data = [
            'package' => $package,
            'settings' => $settings,
            'exportDate' => now()->format('Y-m-d H:i:s'),
        ];

        $filename = 'package_' . Str::slug($package->package_name) . '_' . date('Y-m-d') . '.pdf';

        return $pdfService->download('pdfs.package', $data, $filename);
    }

    /**
     * Export all packages to PDF with filters.
     */
    public function exportAllPdf(Request $request, PdfExportService $pdfService)
    {
        $query = Package::query();

        if ($search = $request->input('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('package_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('package_type', 'like', "%{$search}%");
            });
        }

        if ($packageType = $request->input('package_type')) {
            $query->where('package_type', $packageType);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($minPrice = $request->input('min_price')) {
            $query->where('default_price', '>=', $minPrice);
        }

        if ($maxPrice = $request->input('max_price')) {
            $query->where('default_price', '<=', $maxPrice);
        }

        $packages = $query->orderBy('package_name')->get();
        $settings = Setting::businessInfo();

        $data = [
            'packages' => $packages,
            'settings' => $settings,
            'exportDate' => now()->format('Y-m-d H:i:s'),
            'filters' => $request->only(['search', 'package_type', 'status', 'min_price', 'max_price']),
        ];

        $filename = 'packages_export_' . date('Y-m-d') . '.pdf';

        return $pdfService->download('pdfs.packages', $data, $filename);
    }
}
