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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('customer_code')->unique()->nullable(); // #CUST001
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('mobile', 50)->nullable();
            
            // Address fields
            $table->text('address')->nullable(); // Full address string
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('country')->nullable();
            
            // Branch relationship
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('set null');
            
            // Status
            $table->enum('status', ['active', 'suspended', 'pending', 'inactive'])->default('active');
            
            // Personal info
            $table->date('dob')->nullable(); // Date of birth
            $table->date('anniversary_date')->nullable();
            
            // Stats (calculated from orders, stored for performance)
            $table->integer('total_orders')->default(0);
            $table->integer('total_services')->default(0); // Total packages/services count
            $table->decimal('total_amount', 12, 2)->default(0); // Total spent
            $table->decimal('paid_amount', 12, 2)->default(0); // Total paid
            $table->decimal('remaining_amount', 12, 2)->default(0); // Total - Paid
            $table->decimal('wallet_balance', 12, 2)->default(0);
            $table->dateTime('last_order_date')->nullable();
            
            // Additional fields
            $table->text('notes')->nullable();
            $table->json('preferences')->nullable();
            $table->string('avatar')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('customer_code');
            $table->index('email');
            $table->index('phone');
            $table->index('branch_id');
            $table->index('status');
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
        Schema::dropIfExists('customers');
    }
};
