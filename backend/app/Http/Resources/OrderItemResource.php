<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
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
            'order_id' => $this->order_id,
            'package_id' => $this->package_id,
            'package_name' => $this->package_name ?? $this->package?->package_name,
            'packageName' => $this->package_name ?? $this->package?->package_name,
            'quantity' => $this->quantity,
            'qty' => $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'price' => (float) $this->unit_price,
            'unitPrice' => (float) $this->unit_price,
            'total_price' => (float) $this->total_price,
            'amount' => (float) $this->total_price,
            'totalPrice' => (float) $this->total_price,
        ];
    }
}
