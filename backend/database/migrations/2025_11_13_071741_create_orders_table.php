<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // #ORD001
            $table->foreignId('customer_id')->constrained('customers')->onDelete('restrict');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('set null');
            
            // Dates
            $table->date('order_date');
            $table->date('due_date')->nullable();
            
            // Amounts
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->decimal('balance_amount', 12, 2)->default(0);
            
            // Status
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->enum('payment_status', ['pending', 'paid', 'partial', 'refunded'])->default('pending');
            $table->string('payment_method')->nullable(); // cash, upi, card, bank_transfer
            
            // Additional fields
            $table->text('notes')->nullable();
            $table->json('timeline')->nullable(); // Order status timeline
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('order_number');
            $table->index('customer_id');
            $table->index('branch_id');
            $table->index('order_date');
            $table->index('status');
            $table->index('payment_status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
