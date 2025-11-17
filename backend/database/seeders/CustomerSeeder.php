<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Branch;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $branches = Branch::all()->keyBy('id');
        
        $customers = [
            [
                'customer_code' => '#CUST001',
                'first_name' => 'Rajesh',
                'last_name' => 'Patel',
                'email' => 'rajesh.patel@email.com',
                'mobile' => '+91 98765 43210',
                'phone' => '+91 98765 43210',
                'address' => '123 MG Road',
                'city' => 'Ahmedabad',
                'state' => 'Gujarat',
                'postal_code' => '380001',
                'country' => 'India',
                'branch_id' => $branches->first()?->id ?? 1,
                'status' => 'active',
                'dob' => '1990-05-15',
                'anniversary_date' => '2018-06-20',
                'created_at' => Carbon::parse('2024-01-15T10:30:00.000Z'),
            ],
            [
                'customer_code' => '#CUST002',
                'first_name' => 'Priya',
                'last_name' => 'Sharma',
                'email' => 'priya.sharma@email.com',
                'mobile' => '+91 98765 43211',
                'phone' => '+91 98765 43211',
                'address' => '456 CG Road',
                'city' => 'Vadodara',
                'state' => 'Gujarat',
                'postal_code' => '390001',
                'country' => 'India',
                'branch_id' => $branches->skip(1)->first()?->id ?? 2,
                'status' => 'active',
                'dob' => '1992-08-22',
                'anniversary_date' => '2020-03-10',
                'created_at' => Carbon::parse('2024-02-10T09:15:00.000Z'),
            ],
            [
                'customer_code' => '#CUST003',
                'first_name' => 'Amit',
                'last_name' => 'Kumar',
                'email' => 'amit.kumar@email.com',
                'mobile' => '+91 98765 43212',
                'phone' => '+91 98765 43212',
                'address' => '789 SG Highway',
                'city' => 'Ahmedabad',
                'state' => 'Gujarat',
                'postal_code' => '380015',
                'country' => 'India',
                'branch_id' => $branches->first()?->id ?? 1,
                'status' => 'suspended',
                'dob' => '1988-12-10',
                'anniversary_date' => null,
                'created_at' => Carbon::parse('2024-01-05T11:20:00.000Z'),
            ],
            [
                'customer_code' => '#CUST004',
                'first_name' => 'Sneha',
                'last_name' => 'Desai',
                'email' => 'sneha.desai@email.com',
                'mobile' => '+91 98765 43213',
                'phone' => '+91 98765 43213',
                'address' => '321 Race Course Road',
                'city' => 'Vadodara',
                'state' => 'Gujarat',
                'postal_code' => '390007',
                'country' => 'India',
                'branch_id' => $branches->skip(1)->first()?->id ?? 2,
                'status' => 'active',
                'dob' => '1995-04-18',
                'anniversary_date' => '2022-11-25',
                'created_at' => Carbon::parse('2024-03-20T08:45:00.000Z'),
            ],
            [
                'customer_code' => '#CUST005',
                'first_name' => 'Vikram',
                'last_name' => 'Singh',
                'email' => 'vikram.singh@email.com',
                'mobile' => '+91 98765 43214',
                'phone' => '+91 98765 43214',
                'address' => '654 Satellite Road',
                'city' => 'Ahmedabad',
                'state' => 'Gujarat',
                'postal_code' => '380015',
                'country' => 'India',
                'branch_id' => $branches->first()?->id ?? 1,
                'status' => 'active',
                'dob' => '1985-07-30',
                'anniversary_date' => '2015-02-14',
                'created_at' => Carbon::parse('2023-12-15T14:20:00.000Z'),
            ],
            [
                'customer_code' => '#CUST006',
                'first_name' => 'Anjali',
                'last_name' => 'Mehta',
                'email' => 'anjali.mehta@email.com',
                'mobile' => '+91 98765 43215',
                'phone' => '+91 98765 43215',
                'address' => '987 Alkapuri',
                'city' => 'Vadodara',
                'state' => 'Gujarat',
                'postal_code' => '390005',
                'country' => 'India',
                'branch_id' => $branches->skip(1)->first()?->id ?? 2,
                'status' => 'pending',
                'dob' => '1993-09-05',
                'anniversary_date' => null,
                'created_at' => Carbon::parse('2024-04-10T12:00:00.000Z'),
            ],
        ];

        foreach ($customers as $customerData) {
            Customer::updateOrCreate(
                ['customer_code' => $customerData['customer_code']],
                $customerData
            );
        }
    }
}
