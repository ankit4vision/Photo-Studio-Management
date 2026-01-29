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
        Schema::create('website_project_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('website_projects')->onDelete('cascade');
            $table->string('image_path');
            $table->integer('order')->default(0)->comment('Display order');
            $table->timestamps();

            $table->index('project_id');
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('website_project_photos');
    }
};
