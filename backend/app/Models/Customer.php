<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Payment;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'customer_code',
        'first_name',
        'last_name',
        'email',
        'phone',
        'mobile',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'branch_id',
        'status',
        'dob',
        'anniversary_date',
        'total_orders',
        'total_services',
        'total_amount',
        'paid_amount',
        'remaining_amount',
        'wallet_balance',
        'last_order_date',
        'notes',
        'preferences',
        'avatar',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'dob' => 'date',
        'anniversary_date' => 'date',
        'total_orders' => 'integer',
        'total_services' => 'integer',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'wallet_balance' => 'decimal:2',
        'last_order_date' => 'datetime',
        'preferences' => 'array',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the branch that owns the customer.
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Booted model hook.
     */
    protected static function booted(): void
    {
        static::deleting(function (Customer $customer) {
            $orders = $customer->isForceDeleting()
                ? $customer->orders()->withTrashed()->get()
                : $customer->orders()->get();

            $payments = $customer->isForceDeleting()
                ? $customer->payments()->withTrashed()->get()
                : $customer->payments()->get();

            $orders->each(function ($order) use ($customer) {
                $customer->isForceDeleting() ? $order->forceDelete() : $order->delete();
            });

            $payments->each(function ($payment) use ($customer) {
                $customer->isForceDeleting() ? $payment->forceDelete() : $payment->delete();
            });
        });
    }

    /**
     * Get the orders for the customer.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the payments for the customer.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope a query to only include active customers.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Recalculate customer statistics from orders.
     * This method should be called when orders are created/updated/deleted.
     */
    public function recalculateStats(): void
    {
        $orders = $this->orders()->get();

        $this->total_orders = $orders->count();
        $this->total_services = $orders->sum(function ($order) {
            return $order->items()->sum('quantity');
        });
        $this->total_amount = $orders->sum('total_amount');
        $this->paid_amount = $orders->sum('paid_amount');
        $this->remaining_amount = $this->total_amount - $this->paid_amount;
        $this->last_order_date = $orders->max('order_date');

        $this->save();
    }

    /**
     * Get full name attribute (computed).
     * Note: This is an accessor, not a database column.
     */
    public function getNameAttribute()
    {
        return trim($this->first_name . ' ' . ($this->last_name ?? ''));
    }
}
