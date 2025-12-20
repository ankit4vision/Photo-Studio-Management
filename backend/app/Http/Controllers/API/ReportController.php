<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\FinancialTransaction;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Setting;
use App\Services\PdfExportService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Company Health Report - Overall financial health of the company.
     */
    public function companyHealth(Request $request)
    {
        // Default to current year (Jan 1 to Dec 31) if dates not provided
        $currentYear = Carbon::now()->year;
        $startDate = $request->input('start_date') 
            ? Carbon::parse($request->input('start_date'))->startOfDay() 
            : Carbon::create($currentYear, 1, 1)->startOfDay(); // January 1
        
        $endDate = $request->input('end_date') 
            ? Carbon::parse($request->input('end_date'))->endOfDay() 
            : Carbon::create($currentYear, 12, 31)->endOfDay(); // December 31

        $branchId = $request->input('branch_id');

        // Build base queries with date range
        $orderQuery = Order::whereBetween('order_date', [$startDate, $endDate]);
        $paymentQuery = Payment::whereBetween('payment_date', [$startDate, $endDate]);
        $financialQuery = FinancialTransaction::whereBetween('transaction_date', [$startDate, $endDate]);

        // Apply branch filter if provided
        if ($branchId) {
            $orderQuery->where('branch_id', $branchId);
            $paymentQuery->where('branch_id', $branchId);
        }

        // Financial Summary - Orders
        $totalOrders = (clone $orderQuery)->count();
        $totalRevenue = (float) (clone $orderQuery)->sum('total_amount');
        
        // Calculate paid amount from payments for orders in date range
        $orderIds = (clone $orderQuery)->pluck('id');
        $totalPaidFromOrders = (float) Payment::whereIn('order_id', $orderIds)
            ->selectRaw('SUM(CASE WHEN payment_type = "credit" THEN amount ELSE -amount END) as net_amount')
            ->value('net_amount') ?? 0;
        
        // Outstanding amount = total revenue - paid amount
        $outstandingAmount = $totalRevenue - $totalPaidFromOrders;
        $averageOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        // Orders by Status
        $ordersByStatus = (clone $orderQuery)
            ->select('status', DB::raw('COUNT(*) as count'), DB::raw('SUM(total_amount) as total'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->status => [
                    'count' => $item->count,
                    'total' => (float) $item->total,
                ]];
            });

        // Financial Summary - Payments
        $totalPayments = (clone $paymentQuery)->count();
        $totalPaymentsReceived = (float) (clone $paymentQuery)
            ->where('payment_type', 'credit')
            ->sum('amount');
        $totalRefunds = (float) (clone $paymentQuery)
            ->where('payment_type', 'debit')
            ->sum('amount');
        $netPayments = $totalPaymentsReceived - $totalRefunds;

        // Payments by Method
        $paymentsByMethod = (clone $paymentQuery)
            ->select('payment_method', DB::raw('COUNT(*) as count'), DB::raw('SUM(CASE WHEN payment_type = "credit" THEN amount ELSE -amount END) as net_amount'))
            ->groupBy('payment_method')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->payment_method => [
                    'count' => $item->count,
                    'net_amount' => (float) $item->net_amount,
                ]];
            });

        // Financial Summary - Income & Expenses
        $totalIncome = (float) (clone $financialQuery)
            ->where('transaction_type', 'income')
            ->sum('amount');
        
        $totalExpenses = (float) (clone $financialQuery)
            ->where('transaction_type', 'expense')
            ->sum('amount');
        
        $netProfit = $totalIncome - $totalExpenses;

        // Income by Category
        $incomeByCategory = (clone $financialQuery)
            ->where('transaction_type', 'income')
            ->join('financial_categories', 'financial_transactions.category_id', '=', 'financial_categories.id')
            ->select('financial_categories.name as category_name', DB::raw('SUM(financial_transactions.amount) as total'))
            ->groupBy('financial_categories.name')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category_name,
                    'amount' => (float) $item->total,
                ];
            });

        // Expenses by Category
        $expensesByCategory = (clone $financialQuery)
            ->where('transaction_type', 'expense')
            ->join('financial_categories', 'financial_transactions.category_id', '=', 'financial_categories.id')
            ->select('financial_categories.name as category_name', DB::raw('SUM(financial_transactions.amount) as total'))
            ->groupBy('financial_categories.name')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category_name,
                    'amount' => (float) $item->total,
                ];
            });

        // Monthly Income vs Expenses Comparison
        $monthlyComparison = (clone $financialQuery)
            ->selectRaw('DATE_FORMAT(transaction_date, "%Y-%m") as month, 
                        SUM(CASE WHEN transaction_type = "income" THEN amount ELSE 0 END) as income,
                        SUM(CASE WHEN transaction_type = "expense" THEN amount ELSE 0 END) as expense')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'income' => (float) $item->income,
                    'expense' => (float) $item->expense,
                    'profit' => (float) $item->income - (float) $item->expense,
                ];
            });

        // Orders Trend (daily)
        $ordersTrend = (clone $orderQuery)
            ->selectRaw('DATE(order_date) as date, COUNT(*) as count, SUM(total_amount) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'count' => $item->count,
                    'revenue' => (float) $item->revenue,
                ];
            });

        // Payments Trend (daily)
        $paymentsTrend = (clone $paymentQuery)
            ->selectRaw('DATE(payment_date) as date, 
                        SUM(CASE WHEN payment_type = "credit" THEN amount ELSE -amount END) as net_amount')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'amount' => (float) $item->net_amount,
                ];
            });

        // Financial Health Indicators
        $collectionEfficiency = $totalRevenue > 0 
            ? round(($totalPaidFromOrders / $totalRevenue) * 100, 2) 
            : 0;
        
        $profitMargin = $totalIncome > 0 
            ? round(($netProfit / $totalIncome) * 100, 2) 
            : 0;

        // All Customers - Customers with orders in date range (all customers, not just outstanding)
        $allCustomers = [];
        if ($orderIds->count() > 0) {
            $customersWithOrders = \App\Models\Customer::whereHas('orders', function ($q) use ($orderIds) {
                $q->whereIn('id', $orderIds);
            })
            ->with(['branch', 'orders' => function ($q) use ($orderIds) {
                $q->whereIn('id', $orderIds);
            }])
            ->get();

            $allCustomers = $customersWithOrders->map(function ($customer) {
                // Calculate total amount from orders in date range
                $customerOrderIds = $customer->orders->pluck('id');
                $totalOrderAmount = (float) \App\Models\Order::whereIn('id', $customerOrderIds)
                    ->sum('total_amount');
                
                // Calculate paid amount from payments for these orders
                $paidAmount = (float) Payment::whereIn('order_id', $customerOrderIds)
                    ->selectRaw('SUM(CASE WHEN payment_type = "credit" THEN amount ELSE -amount END) as net_amount')
                    ->value('net_amount') ?? 0;
                
                $remainingAmount = $totalOrderAmount - $paidAmount;

                return [
                    'id' => $customer->id,
                    'customerCode' => $customer->customer_code,
                    'name' => trim(($customer->first_name ?? '') . ' ' . ($customer->last_name ?? '')),
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'branchId' => $customer->branch_id,
                    'branchName' => $customer->branch ? $customer->branch->branch_name : null,
                    'totalOrderAmount' => $totalOrderAmount,
                    'paidAmount' => $paidAmount,
                    'remainingAmount' => $remainingAmount,
                ];
            })
            ->sortByDesc(function ($customer) {
                return $customer['totalOrderAmount'];
            })
            ->values()
            ->toArray();
        }

        // Income & Expense Records - All transactions in date range
        $incomeRecords = (clone $financialQuery)
            ->where('transaction_type', 'income')
            ->with('category')
            ->orderBy('transaction_date', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'date' => $item->transaction_date,
                    'category' => $item->category ? $item->category->name : 'N/A',
                    'description' => $item->description,
                    'amount' => (float) $item->amount,
                ];
            });

        $expenseRecords = (clone $financialQuery)
            ->where('transaction_type', 'expense')
            ->with('category')
            ->orderBy('transaction_date', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'date' => $item->transaction_date,
                    'category' => $item->category ? $item->category->name : 'N/A',
                    'description' => $item->description,
                    'amount' => (float) $item->amount,
                ];
            });

        $totalRecords = $incomeRecords->count() + $expenseRecords->count();

        return response()->json([
            'success' => true,
            'data' => [
                'dateRange' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString(),
                ],
                'financialSummary' => [
                    'totalRevenue' => $totalRevenue,
                    'totalIncome' => $totalIncome,
                    'totalExpenses' => $totalExpenses,
                    'netProfit' => $netProfit,
                    'totalOrders' => $totalOrders,
                    'totalPayments' => $totalPayments,
                    'totalPaymentsReceived' => $totalPaymentsReceived,
                    'totalRefunds' => $totalRefunds,
                    'netPayments' => $netPayments,
                    'outstandingAmount' => $outstandingAmount,
                    'averageOrderValue' => $averageOrderValue,
                    'collectionEfficiency' => $collectionEfficiency,
                    'profitMargin' => $profitMargin,
                ],
                'ordersOverview' => [
                    'totalOrders' => $totalOrders,
                    'byStatus' => $ordersByStatus,
                    'trend' => $ordersTrend,
                    'averageOrderValue' => $averageOrderValue,
                ],
                'paymentsOverview' => [
                    'totalPayments' => $totalPayments,
                    'totalReceived' => $totalPaymentsReceived,
                    'totalRefunds' => $totalRefunds,
                    'netPayments' => $netPayments,
                    'byMethod' => $paymentsByMethod,
                    'trend' => $paymentsTrend,
                ],
                'incomeExpenses' => [
                    'totalIncome' => $totalIncome,
                    'totalExpenses' => $totalExpenses,
                    'netProfit' => $netProfit,
                    'totalRecords' => $totalRecords,
                    'incomeByCategory' => $incomeByCategory,
                    'expensesByCategory' => $expensesByCategory,
                    'monthlyComparison' => $monthlyComparison,
                    'incomeRecords' => $incomeRecords,
                    'expenseRecords' => $expenseRecords,
                ],
                'allCustomers' => $allCustomers,
                'healthIndicators' => [
                    'profitMargin' => $profitMargin,
                    'collectionEfficiency' => $collectionEfficiency,
                    'outstandingRatio' => $totalRevenue > 0 
                        ? round(($outstandingAmount / $totalRevenue) * 100, 2) 
                        : 0,
                ],
            ],
        ]);
    }

    /**
     * Customer Payment Status Report - Customer payment details and outstanding balances.
     */
    public function customerPaymentStatus(Request $request)
    {
        $startDate = $request->input('start_date') 
            ? Carbon::parse($request->input('start_date'))->startOfDay() 
            : null;
        
        $endDate = $request->input('end_date') 
            ? Carbon::parse($request->input('end_date'))->endOfDay() 
            : null;

        $branchId = $request->input('branch_id');
        $paymentStatus = $request->input('payment_status'); // 'all', 'fully_paid', 'partially_paid', 'unpaid'
        $search = $request->input('search');

        // Base query for customers
        $query = Customer::with(['branch']);

        // Apply branch filter
        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('customer_code', 'like', "%{$search}%");
            });
        }

        // Get all customers with their payments
        $customers = $query->with(['payments' => function ($q) {
            $q->orderBy('payment_date', 'desc')->limit(1);
        }])->get();

        // Filter by date range if provided (based on orders created in date range)
        if ($startDate && $endDate) {
            $customers = $customers->filter(function ($customer) use ($startDate, $endDate) {
                // Check if customer has orders in the date range
                $hasOrdersInRange = Order::where('customer_id', $customer->id)
                    ->whereBetween('order_date', [$startDate, $endDate])
                    ->exists();
                return $hasOrdersInRange;
            });
        }

        // Process customers and categorize by payment status
        $customerData = $customers->map(function ($customer) {
            $remainingAmount = (float) ($customer->remaining_amount ?? 0);
            $totalAmount = (float) ($customer->total_amount ?? 0);
            $paidAmount = (float) ($customer->paid_amount ?? 0);

            // Determine payment status
            if ($remainingAmount <= 0 && $totalAmount > 0) {
                $status = 'fully_paid';
            } elseif ($paidAmount > 0 && $remainingAmount > 0) {
                $status = 'partially_paid';
            } else {
                $status = 'unpaid';
            }

            // Get last payment date from payments relationship
            $lastPayment = $customer->payments->first();
            $lastPaymentDate = $lastPayment ? Carbon::parse($lastPayment->payment_date)->toDateString() : null;

            return [
                'id' => $customer->id,
                'customerCode' => $customer->customer_code,
                'name' => trim(($customer->first_name ?? '') . ' ' . ($customer->last_name ?? '')),
                'email' => $customer->email,
                'phone' => $customer->phone,
                'branchId' => $customer->branch_id,
                'branchName' => $customer->branch ? $customer->branch->branch_name : null,
                'totalOrders' => (int) ($customer->total_orders ?? 0),
                'totalAmount' => $totalAmount,
                'paidAmount' => $paidAmount,
                'remainingAmount' => $remainingAmount,
                'paymentStatus' => $status,
                'lastPaymentDate' => $lastPaymentDate,
            ];
        });

        // Apply payment status filter
        if ($paymentStatus && $paymentStatus !== 'all') {
            $customerData = $customerData->filter(function ($customer) use ($paymentStatus) {
                return $customer['paymentStatus'] === $paymentStatus;
            });
        }

        // Calculate summary statistics
        $totalCustomers = $customerData->count();
        $fullyPaidCount = $customerData->where('paymentStatus', 'fully_paid')->count();
        $partiallyPaidCount = $customerData->where('paymentStatus', 'partially_paid')->count();
        $unpaidCount = $customerData->where('paymentStatus', 'unpaid')->count();

        $totalOutstanding = $customerData->sum('remainingAmount');
        $totalCollected = $customerData->sum('paidAmount');
        $totalAmountAll = $customerData->sum('totalAmount');
        
        $averageOutstanding = $totalCustomers > 0 ? round($totalOutstanding / $totalCustomers, 2) : 0;
        $collectionPercentage = $totalAmountAll > 0 ? round(($totalCollected / $totalAmountAll) * 100, 2) : 0;

        // Top customers by outstanding amount
        $topOutstanding = $customerData
            ->where('remainingAmount', '>', 0)
            ->sortByDesc('remainingAmount')
            ->take(10)
            ->values();

        // Convert to array for response
        $customerList = $customerData->values()->toArray();

        return response()->json([
            'success' => true,
            'data' => [
                'dateRange' => $startDate && $endDate ? [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString(),
                ] : null,
                'summary' => [
                    'totalCustomers' => $totalCustomers,
                    'fullyPaidCount' => $fullyPaidCount,
                    'partiallyPaidCount' => $partiallyPaidCount,
                    'unpaidCount' => $unpaidCount,
                    'totalOutstanding' => $totalOutstanding,
                    'totalCollected' => $totalCollected,
                    'totalAmount' => $totalAmountAll,
                    'averageOutstanding' => $averageOutstanding,
                    'collectionPercentage' => $collectionPercentage,
                ],
                'customers' => $customerList,
                'topOutstanding' => $topOutstanding,
            ],
        ]);
    }

    /**
     * Export Company Health Report as PDF.
     */
    public function exportPdf(Request $request, PdfExportService $pdfService)
    {
        // Get report data (same logic as companyHealth method)
        $currentYear = Carbon::now()->year;
        $startDate = $request->input('start_date') 
            ? Carbon::parse($request->input('start_date'))->startOfDay() 
            : Carbon::create($currentYear, 1, 1)->startOfDay();
        
        $endDate = $request->input('end_date') 
            ? Carbon::parse($request->input('end_date'))->endOfDay() 
            : Carbon::create($currentYear, 12, 31)->endOfDay();

        $branchId = $request->input('branch_id');

        // Build base queries with date range
        $orderQuery = Order::whereBetween('order_date', [$startDate, $endDate]);
        $paymentQuery = Payment::whereBetween('payment_date', [$startDate, $endDate]);
        $financialQuery = FinancialTransaction::whereBetween('transaction_date', [$startDate, $endDate]);

        // Apply branch filter if provided
        if ($branchId) {
            $orderQuery->where('branch_id', $branchId);
            $paymentQuery->where('branch_id', $branchId);
        }

        // Financial Summary - Orders
        $totalOrders = (clone $orderQuery)->count();
        $totalRevenue = (float) (clone $orderQuery)->sum('total_amount');
        
        // Calculate paid amount from payments for orders in date range
        $orderIds = (clone $orderQuery)->pluck('id');
        $totalPaidFromOrders = (float) Payment::whereIn('order_id', $orderIds)
            ->selectRaw('SUM(CASE WHEN payment_type = "credit" THEN amount ELSE -amount END) as net_amount')
            ->value('net_amount') ?? 0;
        
        // Outstanding amount = total revenue - paid amount
        $outstandingAmount = $totalRevenue - $totalPaidFromOrders;
        $averageOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        // Financial Summary - Payments
        $totalPaymentsReceived = (float) (clone $paymentQuery)
            ->where('payment_type', 'credit')
            ->sum('amount');
        $totalRefunds = (float) (clone $paymentQuery)
            ->where('payment_type', 'debit')
            ->sum('amount');
        $netPayments = $totalPaymentsReceived - $totalRefunds;

        // Financial Summary - Income & Expenses
        $totalIncome = (float) (clone $financialQuery)
            ->where('transaction_type', 'income')
            ->sum('amount');
        
        $totalExpenses = (float) (clone $financialQuery)
            ->where('transaction_type', 'expense')
            ->sum('amount');
        
        $netProfit = $totalIncome - $totalExpenses;

        // Income by Category
        $incomeByCategory = (clone $financialQuery)
            ->where('transaction_type', 'income')
            ->join('financial_categories', 'financial_transactions.category_id', '=', 'financial_categories.id')
            ->select('financial_categories.name as category_name', DB::raw('SUM(financial_transactions.amount) as total'))
            ->groupBy('financial_categories.name')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category_name,
                    'amount' => (float) $item->total,
                ];
            });

        // Expenses by Category
        $expensesByCategory = (clone $financialQuery)
            ->where('transaction_type', 'expense')
            ->join('financial_categories', 'financial_transactions.category_id', '=', 'financial_categories.id')
            ->select('financial_categories.name as category_name', DB::raw('SUM(financial_transactions.amount) as total'))
            ->groupBy('financial_categories.name')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category_name,
                    'amount' => (float) $item->total,
                ];
            });

        // All Customers
        $allCustomers = [];
        if ($orderIds->count() > 0) {
            $customersWithOrders = Customer::whereHas('orders', function ($q) use ($orderIds) {
                $q->whereIn('id', $orderIds);
            })
            ->with(['branch', 'orders' => function ($q) use ($orderIds) {
                $q->whereIn('id', $orderIds);
            }])
            ->get();

            $allCustomers = $customersWithOrders->map(function ($customer) {
                $customerOrderIds = $customer->orders->pluck('id');
                $totalOrderAmount = (float) Order::whereIn('id', $customerOrderIds)
                    ->sum('total_amount');
                
                $paidAmount = (float) Payment::whereIn('order_id', $customerOrderIds)
                    ->selectRaw('SUM(CASE WHEN payment_type = "credit" THEN amount ELSE -amount END) as net_amount')
                    ->value('net_amount') ?? 0;
                
                $remainingAmount = $totalOrderAmount - $paidAmount;

                return [
                    'id' => $customer->id,
                    'customerCode' => $customer->customer_code,
                    'name' => trim(($customer->first_name ?? '') . ' ' . ($customer->last_name ?? '')),
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'branchName' => $customer->branch ? $customer->branch->branch_name : null,
                    'totalOrderAmount' => $totalOrderAmount,
                    'paidAmount' => $paidAmount,
                    'remainingAmount' => $remainingAmount,
                ];
            })
            ->sortByDesc(function ($customer) {
                return $customer['totalOrderAmount'];
            })
            ->values()
            ->toArray();
        }

        // Income & Expense Records
        $incomeRecords = (clone $financialQuery)
            ->where('transaction_type', 'income')
            ->with('category')
            ->orderBy('transaction_date', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'date' => $item->transaction_date,
                    'category' => $item->category ? $item->category->name : 'N/A',
                    'description' => $item->description,
                    'amount' => (float) $item->amount,
                ];
            });

        $expenseRecords = (clone $financialQuery)
            ->where('transaction_type', 'expense')
            ->with('category')
            ->orderBy('transaction_date', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'date' => $item->transaction_date,
                    'category' => $item->category ? $item->category->name : 'N/A',
                    'description' => $item->description,
                    'amount' => (float) $item->amount,
                ];
            });

        $totalRecords = $incomeRecords->count() + $expenseRecords->count();

        // Financial Overview
        $incomingFlow = $netPayments + $totalIncome;
        $expenseFlow = $totalExpenses;
        $companyProfit = $incomingFlow - $expenseFlow;

        // Get business settings for PDF branding
        $settings = Setting::businessInfo([
            'invoice_business_name',
            'invoice_business_website',
            'invoice_business_address',
            'invoice_contact_phone',
            'invoice_contact_email',
            'invoice_footer_text',
            'business_logo',
        ]);

        // Get branch name if filtered
        $branchName = null;
        if ($branchId) {
            $branch = \App\Models\Branch::find($branchId);
            $branchName = $branch ? $branch->branch_name : null;
        }

        $data = [
            'dateRange' => [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString(),
            ],
            'branchName' => $branchName,
            'financialSummary' => [
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue,
                'netPayments' => $netPayments,
                'outstandingAmount' => $outstandingAmount,
            ],
            'incomeExpenses' => [
                'totalRecords' => $totalRecords,
                'totalIncome' => $totalIncome,
                'totalExpenses' => $totalExpenses,
                'netProfit' => $netProfit,
                'incomeByCategory' => $incomeByCategory,
                'expensesByCategory' => $expensesByCategory,
            ],
            'financialOverview' => [
                'incomingFlow' => $incomingFlow,
                'expenseFlow' => $expenseFlow,
                'companyProfit' => $companyProfit,
                'outstanding' => $outstandingAmount,
            ],
            'allCustomers' => $allCustomers,
            'incomeRecords' => $incomeRecords->take(50), // Limit for PDF
            'expenseRecords' => $expenseRecords->take(50), // Limit for PDF
            'settings' => $settings,
            'exportDate' => now()->format('Y-m-d H:i:s'),
        ];

        $filename = "Company_Health_Report_{$startDate->format('Y-m-d')}_to_{$endDate->format('Y-m-d')}.pdf";

        return $pdfService->download('pdfs.company_health', $data, $filename);
    }
}
