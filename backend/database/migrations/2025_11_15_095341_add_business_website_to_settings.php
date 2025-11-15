<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $exists = DB::table('settings')
            ->where('key', 'business_website')
            ->where('group', 'Business Information')
            ->exists();

        if (!$exists) {
            DB::table('settings')->insert([
                'key' => 'business_website',
                'value' => '',
                'group' => 'Business Information',
                'description' => 'Public website URL',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('settings')
            ->where('key', 'business_website')
            ->where('group', 'Business Information')
            ->delete();
    }
};
