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
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            
            // File Information
            $table->string('filename');
            $table->string('original_filename')->nullable();
            $table->string('file_path', 2048);
            $table->string('file_url', 2048)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('mime_type', 100)->nullable();
            $table->string('file_extension', 10)->nullable();
            
            // Storage Location
            $table->enum('location', ['local', 's3'])->default('local');
            $table->string('storage_disk', 50)->nullable();
            
            // Organization
            $table->string('module', 100);
            $table->string('folder', 100);
            $table->string('resource_type', 100)->nullable();
            
            // Related Entity (Simple and flexible)
            $table->string('related_table', 100);
            $table->unsignedBigInteger('related_id');
            
            // Metadata
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('alt_text')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            
            // Status & Visibility
            $table->enum('visibility', ['public', 'private'])->default('public');
            $table->enum('status', ['active', 'deleted', 'archived'])->default('active');
            
            // Audit Trail
            $table->unsignedBigInteger('uploaded_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['related_table', 'related_id'], 'idx_related');
            $table->index(['module', 'folder'], 'idx_module_folder');
            $table->index('location', 'idx_location');
            $table->index('status', 'idx_status');
            $table->index('uploaded_by', 'idx_uploaded_by');
            $table->index('created_at', 'idx_created_at');
            
            // Foreign Keys
            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('resources');
    }
};

