<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'payment_number' => $this->payment_number,
            'paymentNumber' => $this->payment_number,
            'order_id' => $this->order_id,
            'orderId' => $this->order_id,
            'order' => $this->whenLoaded('order', function () {
                if (!$this->order) {
                    return null;
                }

                return [
                    'id' => $this->order->id,
                    'order_number' => $this->order->order_number,
                    'orderNumber' => $this->order->order_number,
                    'total_amount' => (float) $this->order->total_amount,
                    'totalAmount' => (float) $this->order->total_amount,
                    'paid_amount' => (float) $this->order->paid_amount,
                    'paidAmount' => (float) $this->order->paid_amount,
                    'remaining_amount' => (float) $this->order->remaining_amount,
                    'remainingAmount' => (float) $this->order->remaining_amount,
                    'balance_amount' => (float) ($this->order->remaining_amount ?? 0),
                    'balanceAmount' => (float) ($this->order->remaining_amount ?? 0),
                    'payment_status' => $this->order->payment_status,
                    'paymentStatus' => $this->order->payment_status,
                ];
            }),
            'customer_id' => $this->customer_id,
            'customerId' => $this->customer_id,
            'customer' => $this->whenLoaded('customer', function () {
                if (!$this->customer) {
                    return null;
                }
                return [
                    'id' => $this->customer->id,
                    'firstName' => $this->customer->first_name,
                    'lastName' => $this->customer->last_name,
                    'name' => $this->customer->name,
                    'email' => $this->customer->email,
                    'customer_code' => $this->customer->customer_code,
                    'financials' => [
                        'total_amount' => (float) $this->customer->total_amount,
                        'paid_amount' => (float) $this->customer->paid_amount,
                        'remaining_amount' => (float) $this->customer->remaining_amount,
                    ],
                ];
            }),
            'branch_id' => $this->branch_id,
            'branch' => $this->whenLoaded('branch', function () {
                if (!$this->branch) {
                    return null;
                }
                return [
                    'id' => $this->branch->id,
                    'branch_name' => $this->branch->branch_name,
                    'branch_code' => $this->branch->branch_code,
                ];
            }),
            'payment_date' => $this->payment_date?->format('Y-m-d'),
            'paymentDate' => $this->payment_date?->toISOString(),
            'payment_type' => $this->payment_type,
            'paymentType' => $this->payment_type,
            'amount' => (float) $this->amount,
            'payment_method' => $this->payment_method,
            'paymentMethod' => $this->payment_method,
            'remarks' => $this->remarks,
            'created_at' => $this->created_at,
            'createdAt' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at,
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
