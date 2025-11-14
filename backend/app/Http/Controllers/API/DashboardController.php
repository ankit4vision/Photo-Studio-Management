<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Dashboard summary cards data.
     */
    public function summary(Request $request)
    {
        [$startDate, $endDate, $previousStart, $previousEnd] = $this->resolveDateRanges($request);

        $currentRevenue = $this->getNetRevenue($startDate, $endDate);
        $previousRevenue = $this->getNetRevenue($previousStart, $previousEnd);

        $currentOrders = Order::whereBetween('order_date', [$startDate, $endDate])->count();
        $previousOrders = Order::whereBetween('order_date', [$previousStart, $previousEnd])->count();

        $currentCustomers = Customer::whereBetween('created_at', [$startDate, $endDate])->count();
        $previousCustomers = Customer::whereBetween('created_at', [$previousStart, $previousEnd])->count();

        $overallRevenue = $this->getNetRevenue(Carbon::minValue(), now());
        $overallOrders = Order::count();
        $overallCustomers = Customer::count();

        return response()->json([
            'success' => true,
            'data' => [
                'dateRange' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString(),
                ],
                'totals' => [
                    'revenue' => $currentRevenue,
                    'orders' => $currentOrders,
                    'customers' => $currentCustomers,
                ],
                'overallTotals' => [
                    'revenue' => $overallRevenue,
                    'orders' => $overallOrders,
                    'customers' => $overallCustomers,
                ],
                'changes' => [
                    'revenue' => $this->calculateChange($currentRevenue, $previousRevenue),
                    'orders' => $this->calculateChange($currentOrders, $previousOrders),
                    'customers' => $this->calculateChange($currentCustomers, $previousCustomers),
                ],
            ],
        ]);
    }

    /**
     * Revenue trend grouped by day.
     */
    public function revenueTrend(Request $request)
    {
        $range = (int) ($request->input('range', 30));
        $range = $range > 0 ? $range : 30;

        $endDate = Carbon::parse($request->input('end_date', now()->toDateString()))->endOfDay();
        $startDate = (clone $endDate)->subDays($range - 1)->startOfDay();

        $payments = Payment::selectRaw('DATE(payment_date) as date, SUM(CASE WHEN payment_type = "credit" THEN amount ELSE -amount END) as net_amount')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $trend = [];
        $cursor = (clone $startDate);
        while ($cursor->lte($endDate)) {
            $date = $cursor->toDateString();
            $trend[] = [
                'date' => $date,
                'amount' => (float) ($payments[$date]->net_amount ?? 0),
            ];
            $cursor->addDay();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'range' => $range,
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString(),
                'points' => $trend,
            ],
        ]);
    }

    /**
     * Recent activities feed (orders, payments, customers).
     */
    public function recentActivities()
    {
        $orders = Order::selectRaw('id, order_number as reference, customer_id, order_date as occurred_at, "order" as type')
            ->latest('order_date')
            ->limit(5)
            ->get();

        $payments = Payment::selectRaw('id, payment_number as reference, customer_id, payment_date as occurred_at, "payment" as type')
            ->latest('payment_date')
            ->limit(5)
            ->get();

        $customers = Customer::selectRaw('id, customer_code as reference, id as customer_id, created_at as occurred_at, "customer" as type')
            ->latest('created_at')
            ->limit(5)
            ->get();

        $activities = $orders
            ->concat($payments)
            ->concat($customers)
            ->sortByDesc('occurred_at')
            ->take(4)
            ->values()
            ->map(function ($activity) {
                return [
                    'type' => $activity->type,
                    'reference' => $activity->reference,
                    'customer_id' => $activity->customer_id,
                    'occurred_at' => Carbon::parse($activity->occurred_at)->toDateTimeString(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $activities,
        ]);
    }

    /**
     * Resolve date ranges and previous period.
     */
    private function resolveDateRanges(Request $request): array
    {
        $endDate = Carbon::parse($request->input('end_date', now()->toDateString()))->endOfDay();
        $startDate = Carbon::parse($request->input('start_date', (clone $endDate)->subDays(89)->toDateString()))->startOfDay();

        if ($startDate->gt($endDate)) {
            [$startDate, $endDate] = [$endDate->copy()->startOfDay(), $startDate->copy()->endOfDay()];
        }

        $rangeDays = max(1, $startDate->diffInDays($endDate) + 1);
        $previousEnd = (clone $startDate)->subDay()->endOfDay();
        $previousStart = (clone $previousEnd)->subDays($rangeDays - 1)->startOfDay();

        return [$startDate, $endDate, $previousStart, $previousEnd];
    }

    /**
     * Calculate percentage change.
     */
    private function calculateChange($current, $previous): array
    {
        $difference = $current - $previous;
        $percent = $previous == 0
            ? ($current > 0 ? 100 : 0)
            : ($difference / $previous) * 100;

        return [
            'direction' => $difference >= 0 ? 'up' : 'down',
            'value' => round($percent, 2),
        ];
    }

    /**
     * Calculate net revenue (credits minus debits) for a period.
     */
    private function getNetRevenue(Carbon $start, Carbon $end): float
    {
        return (float) Payment::whereBetween('payment_date', [$start, $end])
            ->selectRaw('SUM(CASE WHEN payment_type = "credit" THEN amount ELSE -amount END) as net_amount')
            ->value('net_amount') ?? 0;
    }
}

