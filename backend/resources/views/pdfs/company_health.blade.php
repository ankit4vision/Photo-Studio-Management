<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Company Health Report</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 18px 18px 12px 18px;
            font-size: 12px;
            color: #000;
            line-height: 1.4;
        }
        .top-bar {
            width: 100%;
            margin-bottom: 12px;
        }
        .top-bar table {
            width: 100%;
            border-collapse: collapse;
        }
        .top-bar .left {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 0.5px;
            vertical-align: middle;
        }
        .logo-img {
            max-width: 120px;
            max-height: 80px;
            object-fit: contain;
            vertical-align: middle;
        }
        .top-bar .logo-right {
            text-align: right;
            vertical-align: middle;
        }
        .company-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
        }
        .company-meta {
            font-size: 12px;
            color: #000;
            margin-bottom: 3px;
            line-height: 1.4;
        }
        .section-title {
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 8px;
            margin-top: 16px;
            letter-spacing: 0.5px;
            color: #000;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            padding-bottom: 4px;
        }
        .summary-cards {
            margin-bottom: 12px;
        }
        .summary-cards table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
        }
        .summary-cards td {
            padding: 8px;
            border: 1px solid #000;
            text-align: center;
            width: 25%;
        }
        .summary-cards .label {
            font-size: 11px;
            color: #666;
            margin-bottom: 4px;
        }
        .summary-cards .value {
            font-size: 14px;
            font-weight: bold;
            color: #000;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }
        .data-table th {
            background: transparent;
            font-weight: bold;
            font-size: 11px;
            padding: 6px 4px;
            border: 1px solid #000;
            text-align: left;
        }
        .data-table td {
            font-size: 11px;
            padding: 5px 4px;
            border: 1px solid #000;
        }
        .data-table .text-right {
            text-align: right;
        }
        .data-table .text-center {
            text-align: center;
        }
        .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #000;
            font-size: 10px;
            color: #666;
            text-align: center;
        }
        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="top-bar">
        <table>
            <tr>
                <td class="left">COMPANY HEALTH REPORT</td>
                <td class="logo-right">
                    @php
                        $logoPath = $settings['business_logo'] ?? null;
                        $logoBase64 = null;
                        if ($logoPath) {
                            $fullPath = public_path('storage/' . $logoPath);
                            if (file_exists($fullPath)) {
                                try {
                                    $imageData = file_get_contents($fullPath);
                                    $imageInfo = getimagesize($fullPath);
                                    if ($imageInfo !== false) {
                                        $mimeType = $imageInfo['mime'];
                                        $logoBase64 = 'data:' . $mimeType . ';base64,' . base64_encode($imageData);
                                    }
                                } catch (\Exception $e) {
                                    \Log::warning('Failed to load business logo for PDF', ['path' => $fullPath, 'error' => $e->getMessage()]);
                                }
                            }
                        }
                    @endphp
                    @if($logoBase64)
                        <img src="{{ $logoBase64 }}" class="logo-img" alt="Logo">
                    @endif
                    <div class="company-name">{{ $settings['invoice_business_name'] ?? 'Company Name' }}</div>
                    @if(isset($settings['invoice_business_address']) && $settings['invoice_business_address'])
                        <div class="company-meta">{{ $settings['invoice_business_address'] }}</div>
                    @endif
                    @if(isset($settings['invoice_contact_phone']) && $settings['invoice_contact_phone'])
                        <div class="company-meta">Phone: {{ $settings['invoice_contact_phone'] }}</div>
                    @endif
                    @if(isset($settings['invoice_contact_email']) && $settings['invoice_contact_email'])
                        <div class="company-meta">Email: {{ $settings['invoice_contact_email'] }}</div>
                    @endif
                </td>
            </tr>
        </table>
    </div>

    <!-- Report Info -->
    <table style="width: 100%; margin-bottom: 12px;">
        <tr>
            <td><strong>Date Range:</strong> {{ $dateRange['start'] }} to {{ $dateRange['end'] }}</td>
            <td style="text-align: right;"><strong>Generated:</strong> {{ $exportDate }}</td>
        </tr>
        @if($branchName)
        <tr>
            <td colspan="2"><strong>Branch:</strong> {{ $branchName }}</td>
        </tr>
        @endif
    </table>

    <!-- Section 1: Order Summary -->
    <div class="section-title">Order Summary</div>
    <div class="summary-cards">
        <table>
            <tr>
                <td>
                    <div class="label">Total Orders</div>
                    <div class="value">{{ number_format($financialSummary['totalOrders'], 0) }}</div>
                </td>
                <td>
                    <div class="label">Order Amount</div>
                    <div class="value">₹{{ number_format($financialSummary['totalRevenue'], 0) }}</div>
                </td>
                <td>
                    <div class="label">Paid Amounts</div>
                    <div class="value">₹{{ number_format($financialSummary['netPayments'], 0) }}</div>
                </td>
                <td>
                    <div class="label">Remaining Amounts</div>
                    <div class="value">₹{{ number_format($financialSummary['outstandingAmount'], 0) }}</div>
                </td>
            </tr>
        </table>
    </div>

    @if(count($allCustomers) > 0)
    <div style="margin-bottom: 8px;"><strong>All Customers ({{ count($allCustomers) }})</strong></div>
    <table class="data-table">
        <thead>
            <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Branch</th>
                <th class="text-right">Order Amount</th>
                <th class="text-right">Paid</th>
                <th class="text-right">Remaining</th>
            </tr>
        </thead>
        <tbody>
            @foreach($allCustomers as $customer)
            <tr>
                <td>{{ $customer['customerCode'] }}</td>
                <td>{{ $customer['name'] }}</td>
                <td>{{ $customer['email'] ?: '-' }}</td>
                <td>{{ $customer['phone'] ?: '-' }}</td>
                <td>{{ $customer['branchName'] ?: '-' }}</td>
                <td class="text-right">₹{{ number_format($customer['totalOrderAmount'], 0) }}</td>
                <td class="text-right">₹{{ number_format($customer['paidAmount'], 0) }}</td>
                <td class="text-right">₹{{ number_format($customer['remainingAmount'], 0) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <!-- Section 2: Income & Expense -->
    <div class="page-break"></div>
    <div class="section-title">Income & Expense</div>
    <div class="summary-cards">
        <table>
            <tr>
                <td>
                    <div class="label">Total Records</div>
                    <div class="value">{{ number_format($incomeExpenses['totalRecords'], 0) }}</div>
                </td>
                <td>
                    <div class="label">Total Income</div>
                    <div class="value">₹{{ number_format($incomeExpenses['totalIncome'], 0) }}</div>
                </td>
                <td>
                    <div class="label">Total Expenses</div>
                    <div class="value">₹{{ number_format($incomeExpenses['totalExpenses'], 0) }}</div>
                </td>
                <td>
                    <div class="label">Net Profit</div>
                    <div class="value">₹{{ number_format($incomeExpenses['netProfit'], 0) }}</div>
                </td>
            </tr>
        </table>
    </div>

    @if(count($incomeExpenses['incomeByCategory']) > 0)
    <div style="margin-bottom: 8px;"><strong>Income by Category</strong></div>
    <table class="data-table">
        <thead>
            <tr>
                <th>Category</th>
                <th class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($incomeExpenses['incomeByCategory'] as $item)
            <tr>
                <td>{{ $item['category'] }}</td>
                <td class="text-right">₹{{ number_format($item['amount'], 0) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    @if(count($incomeRecords) > 0)
    <div style="margin-top: 12px; margin-bottom: 8px;"><strong>Income Records ({{ count($incomeRecords) }})</strong></div>
    <table class="data-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($incomeRecords as $record)
            <tr>
                <td>{{ \Carbon\Carbon::parse($record['date'])->format('Y-m-d') }}</td>
                <td>{{ $record['category'] }}</td>
                <td>{{ $record['description'] ?: '-' }}</td>
                <td class="text-right">₹{{ number_format($record['amount'], 0) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    @if(count($incomeExpenses['expensesByCategory']) > 0)
    <div style="margin-top: 12px; margin-bottom: 8px;"><strong>Expenses by Category</strong></div>
    <table class="data-table">
        <thead>
            <tr>
                <th>Category</th>
                <th class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($incomeExpenses['expensesByCategory'] as $item)
            <tr>
                <td>{{ $item['category'] }}</td>
                <td class="text-right">₹{{ number_format($item['amount'], 0) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    @if(count($expenseRecords) > 0)
    <div style="margin-top: 12px; margin-bottom: 8px;"><strong>Expense Records ({{ count($expenseRecords) }})</strong></div>
    <table class="data-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($expenseRecords as $record)
            <tr>
                <td>{{ \Carbon\Carbon::parse($record['date'])->format('Y-m-d') }}</td>
                <td>{{ $record['category'] }}</td>
                <td>{{ $record['description'] ?: '-' }}</td>
                <td class="text-right">₹{{ number_format($record['amount'], 0) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <!-- Section 3: Financial Overview -->
    <div class="page-break"></div>
    <div class="section-title">Financial Overview</div>
    <div class="summary-cards">
        <table>
            <tr>
                <td>
                    <div class="label">Incoming Flow</div>
                    <div class="value">₹{{ number_format($financialOverview['incomingFlow'], 0) }}</div>
                </td>
                <td>
                    <div class="label">Expense Flow</div>
                    <div class="value">₹{{ number_format($financialOverview['expenseFlow'], 0) }}</div>
                </td>
                <td>
                    <div class="label">Company Profit</div>
                    <div class="value">₹{{ number_format($financialOverview['companyProfit'], 0) }}</div>
                </td>
                <td>
                    <div class="label">Outstanding</div>
                    <div class="value">₹{{ number_format($financialOverview['outstanding'], 0) }}</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Footer -->
    @if(isset($settings['invoice_footer_text']) && $settings['invoice_footer_text'])
    <div class="footer">
        {{ $settings['invoice_footer_text'] }}
    </div>
    @endif
</body>
</html>
