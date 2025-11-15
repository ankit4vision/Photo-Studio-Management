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
        $now = now();

        $settings = [
            [
                'key' => 'business_email',
                'value' => '',
                'group' => 'Business Information',
                'description' => 'Primary business contact email',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'business_phone',
                'value' => '',
                'group' => 'Business Information',
                'description' => 'Primary business contact phone number',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($settings as $setting) {
            $exists = DB::table('settings')
                ->where('key', $setting['key'])
                ->where('group', $setting['group'])
                ->exists();

            if (!$exists) {
                DB::table('settings')->insert($setting);
            }
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
            ->whereIn('key', ['business_email', 'business_phone'])
            ->where('group', 'Business Information')
            ->delete();
    }
};
