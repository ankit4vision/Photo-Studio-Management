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
        Schema::create('website_services', function (Blueprint $table) {
            $table->id();
            $table->string('icon_class')->nullable()->comment('Bootstrap icon class (e.g., bi-camera)');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('service_number')->nullable()->comment('Service number/order display (e.g., 01, 02)');
            $table->integer('order')->default(0)->comment('Display order');
            $table->boolean('is_active')->default(true);
            $table->string('link_url')->nullable()->comment('Optional link to service detail page');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('website_services');
    }
};

