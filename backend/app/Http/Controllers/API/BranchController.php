<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\BranchStoreRequest;
use App\Http\Requests\BranchUpdateRequest;
use App\Http\Resources\BranchResource;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    /**
     * Display a listing of branches.
     */
    public function index(Request $request)
    {
        $query = Branch::query();

        if ($search = $request->input('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('branch_name', 'like', "%{$search}%")
                    ->orWhere('branch_code', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($city = $request->input('city')) {
            $query->where('city', 'like', "%{$city}%");
        }

        if ($request->boolean('paginate', true)) {
            $perPage = (int) $request->input('per_page', 15);
            $branches = $query->orderBy('branch_name')->paginate($perPage > 0 ? $perPage : 15);

            return BranchResource::collection($branches)
                ->additional([
                    'success' => true,
                    'message' => 'Branches retrieved successfully.',
                ]);
        }

        $branches = $query->orderBy('branch_name')->get();

        return BranchResource::collection($branches)
            ->additional([
                'success' => true,
                'message' => 'Branches retrieved successfully.',
            ]);
    }

    /**
     * Store a newly created branch.
     */
    public function store(BranchStoreRequest $request)
    {
        $branch = Branch::create($request->validated());

        return (new BranchResource($branch))
            ->additional([
                'success' => true,
                'message' => 'Branch created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified branch.
     */
    public function show(Branch $branch)
    {
        return (new BranchResource($branch))
            ->additional([
                'success' => true,
                'message' => 'Branch retrieved successfully.',
            ]);
    }

    /**
     * Update the specified branch.
     */
    public function update(BranchUpdateRequest $request, Branch $branch)
    {
        $branch->update($request->validated());

        return (new BranchResource($branch))
            ->additional([
                'success' => true,
                'message' => 'Branch updated successfully.',
            ]);
    }

    /**
     * Remove the specified branch.
     */
    public function destroy(Branch $branch)
    {
        $branch->delete();

        return response()->json([
            'success' => true,
            'message' => 'Branch deleted successfully.',
        ]);
    }
}

