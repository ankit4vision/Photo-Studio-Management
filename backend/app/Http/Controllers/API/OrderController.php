<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\PaginatesResults;
use App\Http\Requests\OrderStoreRequest;
use App\Http\Requests\OrderUpdateRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Package;
use App\Services\PdfExportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    use PaginatesResults;

    /**
     * Display a listing of orders.
     */
    public function index(Request $request)
    {
        $query = Order::with(['customer', 'branch', 'items.package']);

        if ($search = $request->input('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($q) use ($search) {
                        $q->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($paymentStatus = $request->input('payment_status') ?? $request->input('paymentStatus')) {
            $query->where('payment_status', $paymentStatus);
        }

        if ($customerId = $request->input('customer_id') ?? $request->input('customerId')) {
            $query->where('customer_id', $customerId);
        }

        if ($branchId = $request->input('branch_id')) {
            $query->where('branch_id', $branchId);
        }

        if ($startDate = $request->input('start_date') ?? $request->input('startDate')) {
            $query->where('order_date', '>=', $startDate);
        }

        if ($endDate = $request->input('end_date') ?? $request->input('endDate')) {
            $query->where('order_date', '<=', $endDate);
        }

        // Filter by due date range
        if ($dueDateFrom = $request->input('due_date_from') ?? $request->input('dueDateFrom')) {
            $query->whereDate('due_date', '>=', $dueDateFrom);
        }

        if ($dueDateTo = $request->input('due_date_to') ?? $request->input('dueDateTo')) {
            $query->whereDate('due_date', '<=', $dueDateTo);
        }

        // Filter by payment method
        if ($paymentMethod = $request->input('payment_method') ?? $request->input('paymentMethod')) {
            $query->where('payment_method', $paymentMethod);
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

        $minRemainingAmount = $request->input('min_remaining_amount')
            ?? $request->input('minRemainingAmount')
            ?? $request->input('min_balance_amount')
            ?? $request->input('minBalanceAmount');
        if ($minRemainingAmount !== null) {
            $query->where('remaining_amount', '>=', $minRemainingAmount);
        }

        $maxRemainingAmount = $request->input('max_remaining_amount')
            ?? $request->input('maxRemainingAmount')
            ?? $request->input('max_balance_amount')
            ?? $request->input('maxBalanceAmount');
        if ($maxRemainingAmount !== null) {
            $query->where('remaining_amount', '<=', $maxRemainingAmount);
        }

        $pagination = $this->buildPaginator(
            $request,
            $query,
            ['order_number', 'order_date', 'due_date', 'total_amount', 'paid_amount', 'remaining_amount', 'status', 'payment_status', 'payment_method', 'created_at'],
            ['column' => 'created_at', 'direction' => 'desc']
        );

        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = $pagination['paginator'];

        $orders = array_map(
            fn (Order $order) => (new OrderResource($order))->toArray($request),
            $paginator->items()
        );

        return response()->json([
            'success' => true,
            'data' => $orders,
            'meta' => $this->paginationMeta($paginator, $pagination['sortBy'], $pagination['sortDirection']),
        ]);
    }

    /**
     * Store a newly created order.
     */
    public function store(OrderStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $items = $data['items'];
            unset($data['items']);

            // Generate order number if not provided
            if (empty($data['order_number'])) {
                $lastOrder = Order::withTrashed()->orderBy('id', 'desc')->first();
                $nextId = $lastOrder ? $lastOrder->id + 1 : 1;
                $data['order_number'] = '#ORD' . str_pad($nextId, 3, '0', STR_PAD_LEFT);
            }

            // Calculate subtotal from items if not provided
            if (!isset($data['subtotal']) || $data['subtotal'] == 0) {
                $data['subtotal'] = collect($items)->sum(function ($item) {
                    return ($item['quantity'] ?? 1) * ($item['unit_price'] ?? 0);
                });
            }

            // Calculate total_amount if not provided
            if (!isset($data['total_amount']) || $data['total_amount'] == 0) {
                $data['total_amount'] = $data['subtotal'] - ($data['discount'] ?? 0);
            }

            // Set remaining_amount
            $data['remaining_amount'] = max(0, $data['total_amount'] - ($data['paid_amount'] ?? 0));

            // Create order
            $order = Order::create($data);

            // Create order items
            foreach ($items as $itemData) {
                $package = Package::find($itemData['package_id']);
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'package_id' => $itemData['package_id'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'total_price' => $itemData['quantity'] * $itemData['unit_price'],
                    'package_name' => $package?->package_name,
                    'package_type' => $package?->package_type,
                ]);
            }

            // Recalculate order subtotal (this will also update customer stats via model events)
            $order->updateSubtotal();

            DB::commit();

            $order->load('customer', 'branch', 'items.package');

            return (new OrderResource($order))
                ->additional([
                    'success' => true,
                    'message' => 'Order created successfully.',
                ])
                ->response()
                ->setStatusCode(201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        $order->load('customer', 'branch', 'items.package');

        return (new OrderResource($order))
            ->additional([
                'success' => true,
                'message' => 'Order retrieved successfully.',
            ]);
    }

    /**
     * Update the specified order.
     */
    public function update(OrderUpdateRequest $request, Order $order)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $items = $data['items'] ?? null;
            unset($data['items']);

            // Update order
            if (!empty($data)) {
                // Recalculate remaining amount if amounts changed
                if (isset($data['total_amount']) || isset($data['paid_amount'])) {
                    $total = $data['total_amount'] ?? $order->total_amount;
                    $paid = $data['paid_amount'] ?? $order->paid_amount;
                    $data['remaining_amount'] = max(0, $total - $paid);
                }

                $order->update($data);
                $order->recalculateRemainingAmount();
                $order->save();
            }

            // Update items if provided
            if ($items !== null) {
                // Delete existing items
                $order->items()->delete();

                // Create new items
                foreach ($items as $itemData) {
                    $package = Package::find($itemData['package_id']);
                    
                    OrderItem::create([
                        'order_id' => $order->id,
                        'package_id' => $itemData['package_id'],
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $itemData['unit_price'],
                        'total_price' => $itemData['quantity'] * $itemData['unit_price'],
                        'package_name' => $package?->package_name,
                        'package_type' => $package?->package_type,
                    ]);
                }

                // Recalculate order subtotal
                $order->updateSubtotal();
            }

            DB::commit();

            $order->load('customer', 'branch', 'items.package');

            return (new OrderResource($order))
                ->additional([
                    'success' => true,
                    'message' => 'Order updated successfully.',
                ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified order.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully.',
        ]);
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => ['required', 'in:pending,processing,completed,cancelled'],
        ]);

        $order->update(['status' => $request->status]);

        $order->load('customer', 'branch', 'items.package');

        return (new OrderResource($order))
            ->additional([
                'success' => true,
                'message' => 'Order status updated successfully.',
            ]);
    }

    /**
     * Update payment status.
     */
    public function updatePaymentStatus(Request $request, Order $order)
    {
        $request->validate([
            'payment_status' => ['required', 'in:pending,paid,partial,refunded'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'payment_method' => ['nullable', 'string', 'in:cash,upi,card,bank_transfer'],
        ]);

        if ($request->has('paid_amount')) {
            $order->paid_amount = $request->paid_amount;
        }

        $order->payment_status = $request->payment_status;
        
        if ($request->has('payment_method')) {
            $order->payment_method = $request->payment_method;
        }

        $order->recalculateRemainingAmount();
        $order->save();

        $order->load('customer', 'branch', 'items.package');

        return (new OrderResource($order))
            ->additional([
                'success' => true,
                'message' => 'Payment status updated successfully.',
            ]);
    }

    /**
     * Get orders by customer.
     */
    public function getByCustomer(Request $request, $customerId)
    {
        $query = Order::where('customer_id', $customerId)
            ->with(['branch', 'items.package']);

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $pagination = $this->buildPaginator(
            $request,
            $query,
            ['order_date', 'total_amount', 'status', 'created_at'],
            ['column' => 'created_at', 'direction' => 'desc']
        );

        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = $pagination['paginator'];

        $orders = array_map(
            fn (Order $order) => (new OrderResource($order))->toArray($request),
            $paginator->items()
        );

        return response()->json([
            'success' => true,
            'data' => $orders,
            'meta' => $this->paginationMeta($paginator, $pagination['sortBy'], $pagination['sortDirection']),
        ]);
    }

    /**
     * Export order data to PDF.
     */
    public function exportPdf(Order $order, PdfExportService $pdfService)
    {
        $order->load([
            'customer',
            'branch',
            'items.package',
            'payments' => function ($query) {
                $query->orderBy('payment_date', 'desc');
            }
        ]);

        // Get settings for company info
        $settings = \App\Models\Setting::whereIn('key', [
            'business_name',
            'business_address',
            'business_phone',
            'business_email',
            'business_logo',
            'invoice_prefix',
            'tax_number'
        ])->pluck('value', 'key')->toArray();

        $data = [
            'order' => $order,
            'settings' => $settings,
            'exportDate' => now()->format('Y-m-d H:i:s'),
        ];

        $filename = 'order_' . $order->order_number . '_' . date('Y-m-d') . '.pdf';

        return $pdfService->download('pdfs.order', $data, $filename);
    }

    /**
     * Export all orders to PDF with filters.
     */
    public function exportAllPdf(Request $request, PdfExportService $pdfService)
    {
        $query = Order::with(['customer', 'branch', 'items.package']);

        // Apply same filters as index method
        if ($search = $request->input('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($q) use ($search) {
                        $q->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($paymentStatus = $request->input('payment_status') ?? $request->input('paymentStatus')) {
            $query->where('payment_status', $paymentStatus);
        }

        if ($customerId = $request->input('customer_id') ?? $request->input('customerId')) {
            $query->where('customer_id', $customerId);
        }

        if ($branchId = $request->input('branch_id')) {
            $query->where('branch_id', $branchId);
        }

        if ($startDate = $request->input('start_date') ?? $request->input('startDate')) {
            $query->where('order_date', '>=', $startDate);
        }

        if ($endDate = $request->input('end_date') ?? $request->input('endDate')) {
            $query->where('order_date', '<=', $endDate);
        }

        $orders = $query->orderBy('order_date', 'desc')->get();

        // Get settings for company info
        $settings = \App\Models\Setting::whereIn('key', [
            'business_name',
            'business_address',
            'business_phone',
            'business_email',
            'business_logo'
        ])->pluck('value', 'key')->toArray();

        $data = [
            'orders' => $orders,
            'settings' => $settings,
            'exportDate' => now()->format('Y-m-d H:i:s'),
            'filters' => $request->only(['search', 'status', 'payment_status', 'customer_id', 'branch_id', 'start_date', 'end_date']),
        ];

        $filename = 'orders_export_' . date('Y-m-d') . '.pdf';

        return $pdfService->download('pdfs.orders', $data, $filename);
    }
}
