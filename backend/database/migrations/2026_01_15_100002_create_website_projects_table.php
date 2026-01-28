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
        Schema::create('website_projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author')->nullable()->comment('Photographer/Author name');
            $table->string('thumbnail_image');
            $table->unsignedBigInteger('album_id')->nullable()->comment('Link to album if exists');
            $table->string('category')->nullable();
            $table->json('tags')->nullable()->comment('Array of tags');
            $table->boolean('is_featured')->default(false)->comment('Show on homepage');
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->index('is_featured');
            $table->index('is_active');
            $table->index('order');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('website_projects');
    }
};

