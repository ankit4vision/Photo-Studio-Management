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
        // Drop tables in reverse order to handle foreign key constraints
        // Drop child tables first, then parent tables
        Schema::dropIfExists('website_project_photos');
        Schema::dropIfExists('website_projects');
        Schema::dropIfExists('website_gallery_videos');
        Schema::dropIfExists('website_gallery');
        Schema::dropIfExists('website_home_gallery');
        Schema::dropIfExists('website_testimonials');
        Schema::dropIfExists('website_services');
        Schema::dropIfExists('website_sliders');
        Schema::dropIfExists('website_albums');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // This migration only drops tables, so down() is intentionally left empty
        // If you need to recreate these tables, you would need to restore the original migration files
    }
};
