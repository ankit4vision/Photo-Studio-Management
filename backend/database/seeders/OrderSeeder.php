<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Customer;
use App\Models\Package;
use App\Models\Branch;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $customers = Customer::all()->keyBy('id');
        $packages = Package::all()->keyBy('id');
        $branches = Branch::all()->keyBy('id');

        $orders = [
            [
                'order_number' => '#ORD001',
                'customer_id' => 1,
                'branch_id' => $branches->first()?->id ?? 1,
                'order_date' => '2024-01-20',
                'subtotal' => 50000,
                'discount' => 0,
                'total_amount' => 50000,
                'paid_amount' => 50000,
                'remaining_amount' => 0,
                'status' => 'completed',
                'payment_status' => 'paid',
                'payment_method' => 'upi',
                'created_at' => Carbon::parse('2024-01-20T10:30:00.000Z'),
                'items' => [
                    ['package_id' => 2, 'quantity' => 1, 'unit_price' => 50000], // Wedding Photography Premium
                ],
            ],
            [
                'order_number' => '#ORD002',
                'customer_id' => 2,
                'branch_id' => $branches->skip(1)->first()?->id ?? 2,
                'order_date' => '2024-02-15',
                'subtotal' => 8000,
                'discount' => 0,
                'total_amount' => 8000,
                'paid_amount' => 8000,
                'remaining_amount' => 0,
                'status' => 'processing',
                'payment_status' => 'paid',
                'payment_method' => 'card',
                'created_at' => Carbon::parse('2024-02-15T14:20:00.000Z'),
                'items' => [
                    ['package_id' => 3, 'quantity' => 1, 'unit_price' => 8000], // Portrait Photography Session
                ],
            ],
            [
                'order_number' => '#ORD003',
                'customer_id' => 3,
                'branch_id' => $branches->first()?->id ?? 1,
                'order_date' => '2024-03-10',
                'subtotal' => 25000,
                'discount' => 0,
                'total_amount' => 25000,
                'paid_amount' => 20000,
                'remaining_amount' => 5000,
                'status' => 'pending',
                'payment_status' => 'partial',
                'payment_method' => 'cash',
                'created_at' => Carbon::parse('2024-03-10T09:00:00.000Z'),
                'items' => [
                    ['package_id' => 1, 'quantity' => 1, 'unit_price' => 25000], // Wedding Photography Basic
                ],
            ],
            [
                'order_number' => '#ORD004',
                'customer_id' => 4,
                'branch_id' => $branches->skip(1)->first()?->id ?? 2,
                'order_date' => '2024-03-25',
                'subtotal' => 15000,
                'discount' => 0,
                'total_amount' => 15000,
                'paid_amount' => 15000,
                'remaining_amount' => 0,
                'status' => 'completed',
                'payment_status' => 'paid',
                'payment_method' => 'bank_transfer',
                'created_at' => Carbon::parse('2024-03-25T11:15:00.000Z'),
                'items' => [
                    ['package_id' => 4, 'quantity' => 1, 'unit_price' => 15000], // Event Photography (using package 4 as Pre-Wedding Shoot doesn't exist)
                ],
            ],
            [
                'order_number' => '#ORD005',
                'customer_id' => 5,
                'branch_id' => $branches->first()?->id ?? 1,
                'order_date' => '2024-04-05',
                'subtotal' => 25000,
                'discount' => 0,
                'total_amount' => 25000,
                'paid_amount' => 20000,
                'remaining_amount' => 5000,
                'status' => 'processing',
                'payment_status' => 'partial',
                'payment_method' => 'upi',
                'created_at' => Carbon::parse('2024-04-05T16:30:00.000Z'),
                'items' => [
                    ['package_id' => 6, 'quantity' => 1, 'unit_price' => 25000], // Wedding Album Premium
                ],
            ],
            [
                'order_number' => '#ORD006',
                'customer_id' => 6,
                'branch_id' => $branches->skip(1)->first()?->id ?? 2,
                'order_date' => '2024-04-12',
                'subtotal' => 2000,
                'discount' => 0,
                'total_amount' => 2000,
                'paid_amount' => 10000,
                'remaining_amount' => -8000, // Overpaid
                'status' => 'pending',
                'payment_status' => 'paid',
                'payment_method' => 'cash',
                'created_at' => Carbon::parse('2024-04-12T10:00:00.000Z'),
                'items' => [
                    ['package_id' => 5, 'quantity' => 1, 'unit_price' => 2000], // Photo Editing Basic
                ],
            ],
        ];

        foreach ($orders as $orderData) {
            $items = $orderData['items'];
            unset($orderData['items']);

            $order = Order::updateOrCreate(
                ['order_number' => $orderData['order_number']],
                $orderData
            );

            // Create order items
            foreach ($items as $itemData) {
                $package = $packages->get($itemData['package_id']);
                if ($package) {
                    OrderItem::updateOrCreate(
                        [
                            'order_id' => $order->id,
                            'package_id' => $itemData['package_id'],
                        ],
                        [
                            'quantity' => $itemData['quantity'],
                            'unit_price' => $itemData['unit_price'],
                            'total_price' => $itemData['quantity'] * $itemData['unit_price'],
                            'package_name' => $package->package_name,
                            'package_type' => $package->package_type,
                        ]
                    );
                }
            }

            // Recalculate customer stats
            if ($order->customer) {
                $order->customer->recalculateStats();
            }
        }
    }
}
