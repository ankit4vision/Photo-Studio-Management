<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\PaginatesResults;
use App\Http\Requests\CustomerStoreRequest;
use App\Http\Requests\CustomerUpdateRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    use PaginatesResults;

    /**
     * Display a listing of customers.
     */
    public function index(Request $request)
    {
        $query = Customer::with('branch');

        if ($search = $request->input('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('mobile', 'like', "%{$search}%")
                    ->orWhere('customer_code', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($branchId = $request->input('branch_id')) {
            $query->where('branch_id', $branchId);
        }

        if ($city = $request->input('city')) {
            $query->where('city', 'like', "%{$city}%");
        }

        if ($state = $request->input('state')) {
            $query->where('state', 'like', "%{$state}%");
        }

        if ($country = $request->input('country')) {
            $query->where('country', 'like', "%{$country}%");
        }

        // Filter by date ranges
        if ($createdFrom = $request->input('created_from') ?? $request->input('createdFrom')) {
            $query->whereDate('created_at', '>=', $createdFrom);
        }

        if ($createdTo = $request->input('created_to') ?? $request->input('createdTo')) {
            $query->whereDate('created_at', '<=', $createdTo);
        }

        if ($lastOrderFrom = $request->input('last_order_from') ?? $request->input('lastOrderFrom')) {
            $query->whereDate('last_order_date', '>=', $lastOrderFrom);
        }

        if ($lastOrderTo = $request->input('last_order_to') ?? $request->input('lastOrderTo')) {
            $query->whereDate('last_order_date', '<=', $lastOrderTo);
        }

        // Filter by amount ranges
        if ($minTotalAmount = $request->input('min_total_amount') ?? $request->input('minTotalAmount')) {
            $query->where('total_amount', '>=', $minTotalAmount);
        }

        if ($maxTotalAmount = $request->input('max_total_amount') ?? $request->input('maxTotalAmount')) {
            $query->where('total_amount', '<=', $maxTotalAmount);
        }

        if ($minPaidAmount = $request->input('min_paid_amount') ?? $request->input('minPaidAmount')) {
            $query->where('paid_amount', '>=', $minPaidAmount);
        }

        if ($maxPaidAmount = $request->input('max_paid_amount') ?? $request->input('maxPaidAmount')) {
            $query->where('paid_amount', '<=', $maxPaidAmount);
        }

        if ($minRemainingAmount = $request->input('min_remaining_amount') ?? $request->input('minRemainingAmount')) {
            $query->where('remaining_amount', '>=', $minRemainingAmount);
        }

        if ($maxRemainingAmount = $request->input('max_remaining_amount') ?? $request->input('maxRemainingAmount')) {
            $query->where('remaining_amount', '<=', $maxRemainingAmount);
        }

        $pagination = $this->buildPaginator(
            $request,
            $query,
            ['first_name', 'last_name', 'email', 'city', 'state', 'status', 'total_amount', 'paid_amount', 'remaining_amount', 'created_at', 'last_order_date'],
            ['column' => 'created_at', 'direction' => 'desc']
        );

        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = $pagination['paginator'];

        $customers = array_map(
            fn (Customer $customer) => (new CustomerResource($customer))->toArray($request),
            $paginator->items()
        );

        return response()->json([
            'success' => true,
            'data' => $customers,
            'meta' => $this->paginationMeta($paginator, $pagination['sortBy'], $pagination['sortDirection']),
        ]);
    }

    /**
     * Store a newly created customer.
     */
    public function store(CustomerStoreRequest $request)
    {
        $data = $request->validated();
        
        // Generate customer code if not provided
        if (empty($data['customer_code'])) {
            $lastCustomer = Customer::withTrashed()->orderBy('id', 'desc')->first();
            $nextId = $lastCustomer ? $lastCustomer->id + 1 : 1;
            $data['customer_code'] = '#CUST' . str_pad($nextId, 3, '0', STR_PAD_LEFT);
        }

        // Convert empty strings to null
        $data = array_map(function ($value) {
            return $value === '' ? null : $value;
        }, $data);

        $customer = Customer::create($data);

        return (new CustomerResource($customer))
            ->additional([
                'success' => true,
                'message' => 'Customer created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified customer.
     */
    public function show(Customer $customer)
    {
        $customer->load('branch', 'orders.items.package');

        return (new CustomerResource($customer))
            ->additional([
                'success' => true,
                'message' => 'Customer retrieved successfully.',
            ]);
    }

    /**
     * Update the specified customer.
     */
    public function update(CustomerUpdateRequest $request, Customer $customer)
    {
        $data = $request->validated();

        // Convert empty strings to null
        $data = array_map(function ($value) {
            return $value === '' ? null : $value;
        }, $data);

        $customer->update($data);

        return (new CustomerResource($customer))
            ->additional([
                'success' => true,
                'message' => 'Customer updated successfully.',
            ]);
    }

    /**
     * Remove the specified customer.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer deleted successfully.',
        ]);
    }

    /**
     * Update customer status.
     */
    public function updateStatus(Request $request, Customer $customer)
    {
        $request->validate([
            'status' => ['required', 'in:active,suspended,pending,inactive'],
        ]);

        $customer->update(['status' => $request->status]);

        return (new CustomerResource($customer))
            ->additional([
                'success' => true,
                'message' => 'Customer status updated successfully.',
            ]);
    }

    /**
     * Recalculate customer statistics.
     */
    public function recalculateStats(Customer $customer)
    {
        $customer->recalculateStats();

        return (new CustomerResource($customer))
            ->additional([
                'success' => true,
                'message' => 'Customer statistics recalculated successfully.',
            ]);
    }
}
