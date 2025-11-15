<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'payment_number',
        'order_id',
        'customer_id',
        'branch_id',
        'payment_date',
        'payment_type',
        'amount',
        'payment_method',
        'remarks',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
        'deleted_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Generate payment_number before creating
        static::creating(function ($payment) {
            if (!$payment->payment_number) {
                $payment->payment_number = static::generatePaymentNumber();
            }
        });

        // Update order payment status when payment is created
        static::created(function ($payment) {
            $payment->updateOrderPaymentStatus();
        });

        // Update order payment status when payment is updated
        static::updated(function ($payment) {
            $payment->updateOrderPaymentStatus();
        });

        // Update order payment status when payment is deleted
        static::deleted(function ($payment) {
            if ($payment->order) {
                $payment->order->recalculatePaymentStatus();
            }
        });
    }

    /**
     * Generate unique payment number.
     */
    public static function generatePaymentNumber()
    {
        $lastPayment = static::withTrashed()
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = $lastPayment ? ((int) str_replace('#PAY', '', $lastPayment->payment_number)) + 1 : 1;

        return '#PAY' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Update order payment status based on payments.
     */
    public function updateOrderPaymentStatus(): void
    {
        $order = $this->order()->first();

        if (!$order) {
            return;
        }

        $order->recalculatePaymentStatus();
        $order->refresh();
    }

    /**
     * Get the order that owns the payment.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the customer that owns the payment.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the branch that owns the payment.
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
