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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('package_id')->constrained('packages')->onDelete('restrict');
            
            // Item details
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 12, 2); // quantity * unit_price
            
            // Additional info (stored for historical reference)
            $table->string('package_name')->nullable(); // Snapshot of package name at time of order
            $table->string('package_type')->nullable(); // Snapshot of package type
            
            $table->timestamps();
            
            // Indexes
            $table->index('order_id');
            $table->index('package_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_items');
    }
};
