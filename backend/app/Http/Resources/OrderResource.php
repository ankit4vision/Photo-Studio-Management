<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'order_number' => $this->order_number,
            'orderNumber' => $this->order_number,
            'customerId' => $this->customer_id,
            'customer_id' => $this->customer_id,
            'customer' => $this->whenLoaded('customer', function () {
                return [
                    'id' => $this->customer->id,
                    'firstName' => $this->customer->first_name,
                    'lastName' => $this->customer->last_name,
                    'name' => $this->customer->name,
                    'email' => $this->customer->email,
                    'phone' => $this->customer->phone ?? $this->customer->mobile,
                    'avatar' => $this->customer->avatar,
                    'customer_code' => $this->customer->customer_code,
                    'customerId' => $this->customer->customer_code ?? '#CUST' . str_pad($this->customer->id, 3, '0', STR_PAD_LEFT),
                    'photographerId' => $this->customer->customer_code ?? '#CUST' . str_pad($this->customer->id, 3, '0', STR_PAD_LEFT),
                ];
            }),
            'branch_id' => $this->branch_id,
            'order_date' => $this->order_date?->format('Y-m-d'),
            'orderDate' => $this->order_date?->toISOString(),
            'due_date' => $this->due_date?->format('Y-m-d'),
            'dueDate' => $this->due_date?->toISOString(),
            'subtotal' => (float) $this->subtotal,
            'discount' => (float) $this->discount,
            'total_amount' => (float) $this->total_amount,
            'totalAmount' => (float) $this->total_amount,
            'amount' => (float) $this->total_amount,
            'paid_amount' => (float) $this->paid_amount,
            'paid' => (float) $this->paid_amount,
            'balance_amount' => (float) $this->balance_amount,
            'balance' => (float) $this->balance_amount,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'paymentStatus' => $this->payment_status,
            'payment_method' => $this->payment_method,
            'paymentMethod' => $this->payment_method,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'notes' => $this->notes,
            'timeline' => $this->timeline,
            'created_at' => $this->created_at,
            'createdAt' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at,
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
