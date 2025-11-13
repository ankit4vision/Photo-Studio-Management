<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_number',
        'customer_id',
        'branch_id',
        'order_date',
        'due_date',
        'subtotal',
        'discount',
        'total_amount',
        'paid_amount',
        'balance_amount',
        'status',
        'payment_status',
        'payment_method',
        'notes',
        'timeline',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'order_date' => 'date',
        'due_date' => 'date',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'balance_amount' => 'decimal:2',
        'timeline' => 'array',
        'deleted_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Update customer stats when order is created
        static::created(function ($order) {
            $order->updateCustomerStats();
        });

        // Update customer stats when order is updated
        static::updated(function ($order) {
            $order->updateCustomerStats();
        });

        // Update customer stats when order is deleted
        static::deleted(function ($order) {
            if ($order->customer) {
                $order->customer->recalculateStats();
            }
        });
    }

    /**
     * Get the customer that owns the order.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the branch that owns the order.
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Get the order items for the order.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Update customer statistics when order changes.
     */
    public function updateCustomerStats(): void
    {
        if ($this->customer) {
            $this->customer->recalculateStats();
        }
    }

    /**
     * Calculate balance amount.
     */
    public function calculateBalance(): void
    {
        $this->balance_amount = $this->total_amount - $this->paid_amount;
        
        // Update payment status based on balance
        if ($this->balance_amount <= 0) {
            $this->payment_status = 'paid';
        } elseif ($this->paid_amount > 0) {
            $this->payment_status = 'partial';
        } else {
            $this->payment_status = 'pending';
        }
    }

    /**
     * Recalculate payment status from payments.
     */
    public function recalculatePaymentStatus(): void
    {
        // Calculate paid_amount from payments
        $totalPaid = $this->payments()
            ->where('payment_type', 'credit')
            ->sum('amount');
        
        $totalRefunded = $this->payments()
            ->where('payment_type', 'debit')
            ->sum('amount');
        
        $this->paid_amount = max(0, $totalPaid - $totalRefunded);
        $this->calculateBalance();
        $this->save();
        
        // Update customer stats
        $this->updateCustomerStats();
    }

    /**
     * Get the payments for the order.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Update order subtotal from items.
     */
    public function updateSubtotal(): void
    {
        $this->subtotal = $this->items()->sum('total_price');
        $this->total_amount = $this->subtotal - $this->discount;
        $this->calculateBalance();
        $this->save();
    }

    /**
     * Scope a query to only include orders by status.
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include orders by payment status.
     */
    public function scopeByPaymentStatus($query, $paymentStatus)
    {
        return $query->where('payment_status', $paymentStatus);
    }
}
