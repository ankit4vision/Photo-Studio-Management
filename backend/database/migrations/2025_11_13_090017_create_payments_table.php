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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_number')->unique(); // #PAY001
            $table->foreignId('order_id')->constrained('orders')->onDelete('restrict');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('restrict');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('set null');
            
            // Payment details
            $table->date('payment_date');
            $table->enum('payment_type', ['credit', 'debit'])->default('credit'); // credit = payment received, debit = refund
            $table->decimal('amount', 12, 2);
            $table->enum('payment_method', ['cash', 'upi', 'card', 'bank_transfer'])->default('cash');
            
            // Additional fields
            $table->text('remarks')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('payment_number');
            $table->index('order_id');
            $table->index('customer_id');
            $table->index('branch_id');
            $table->index('payment_date');
            $table->index('payment_type');
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
        Schema::dropIfExists('payments');
    }
};
