<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FinancialCategory;

class FinancialCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            // Income Categories
            [
                'type' => 'income',
                'name' => 'Photography Services',
                'description' => 'Revenue from photography sessions (weddings, portraits, events, etc.)',
                'status' => 'active',
            ],
            [
                'type' => 'income',
                'name' => 'Video Services',
                'description' => 'Revenue from videography services (wedding videos, event coverage, etc.)',
                'status' => 'active',
            ],
            [
                'type' => 'income',
                'name' => 'Print Sales',
                'description' => 'Revenue from photo prints and enlargements',
                'status' => 'active',
            ],
            [
                'type' => 'income',
                'name' => 'Album Sales',
                'description' => 'Revenue from photo albums and books',
                'status' => 'active',
            ],
            [
                'type' => 'income',
                'name' => 'Additional Services',
                'description' => 'Revenue from additional services (retouching, editing, framing, etc.)',
                'status' => 'active',
            ],
            [
                'type' => 'income',
                'name' => 'Consultation Fees',
                'description' => 'Revenue from consultation and booking fees',
                'status' => 'active',
            ],
            [
                'type' => 'income',
                'name' => 'Retouching Services',
                'description' => 'Revenue from photo retouching and editing services',
                'status' => 'active',
            ],
            [
                'type' => 'income',
                'name' => 'Event Coverage',
                'description' => 'Revenue from event photography and videography coverage',
                'status' => 'active',
            ],
            [
                'type' => 'income',
                'name' => 'Package Sales',
                'description' => 'Revenue from photography/videography packages',
                'status' => 'active',
            ],
            [
                'type' => 'income',
                'name' => 'Other Income',
                'description' => 'Other miscellaneous income sources',
                'status' => 'active',
            ],

            // Expense Categories
            [
                'type' => 'expense',
                'name' => 'Equipment Purchase',
                'description' => 'Expenses for purchasing cameras, lenses, lighting equipment, etc.',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Equipment Maintenance',
                'description' => 'Expenses for equipment repair, servicing, and maintenance',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Studio Rent',
                'description' => 'Monthly rent for studio space',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Utilities',
                'description' => 'Electricity, water, internet, and other utility bills',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Marketing & Advertising',
                'description' => 'Expenses for marketing campaigns, social media ads, print ads, etc.',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Staff Salaries',
                'description' => 'Salaries and wages for employees',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Transportation',
                'description' => 'Travel expenses for on-location shoots (fuel, vehicle maintenance, etc.)',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Supplies & Materials',
                'description' => 'Expenses for photo paper, albums, frames, props, and other supplies',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Software Subscriptions',
                'description' => 'Expenses for photo editing software, cloud storage, and other subscriptions',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Insurance',
                'description' => 'Business insurance, equipment insurance, liability insurance',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Professional Services',
                'description' => 'Expenses for legal, accounting, consulting, and other professional services',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Office Supplies',
                'description' => 'Expenses for office supplies and stationery',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Training & Education',
                'description' => 'Expenses for workshops, courses, and professional development',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Bank Charges',
                'description' => 'Bank fees, transaction charges, and other banking expenses',
                'status' => 'active',
            ],
            [
                'type' => 'expense',
                'name' => 'Miscellaneous',
                'description' => 'Other miscellaneous business expenses',
                'status' => 'active',
            ],
        ];

        foreach ($categories as $category) {
            FinancialCategory::updateOrCreate(
                [
                    'type' => $category['type'],
                    'name' => $category['name'],
                ],
                $category
            );
        }

        $this->command->info('Financial categories seeded successfully!');
    }
}
