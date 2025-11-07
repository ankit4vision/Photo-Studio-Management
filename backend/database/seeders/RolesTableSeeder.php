<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = [
            [
                'name' => 'admin',
                'description' => 'Administrator with full access',
                'is_active' => true,
                'is_deleted' => false,
            ],
            [
                'name' => 'manager',
                'description' => 'Manager role',
                'is_active' => true,
                'is_deleted' => false,
            ],
            [
                'name' => 'staff',
                'description' => 'Staff member',
                'is_active' => true,
                'is_deleted' => false,
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}

