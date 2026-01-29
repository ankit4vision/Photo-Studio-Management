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
        Schema::table('website_projects', function (Blueprint $table) {
            $table->text('description')->nullable()->after('author')->comment('Project/Album description with rich text');
            $table->date('event_date')->nullable()->after('description')->comment('Event date for the project');
            $table->string('location')->nullable()->after('event_date')->comment('Location of the event/project');
            $table->string('photographer')->nullable()->after('location')->comment('Photographer name (can override author)');
            $table->string('hero_image')->nullable()->after('thumbnail_image')->comment('Hero image for detail page (same as thumbnail for Our Works)');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('website_projects', function (Blueprint $table) {
            $table->dropColumn(['description', 'event_date', 'location', 'photographer', 'hero_image']);
        });
    }
};
