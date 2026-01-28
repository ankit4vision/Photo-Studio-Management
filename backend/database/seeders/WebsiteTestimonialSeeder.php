<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Website\Testimonial;

class WebsiteTestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Current static data from website/website_react/src/pages/Home.jsx
        // testimonials array
        $testimonials = [
            [
                'customer_name' => 'Rachel Jackson',
                'location' => 'New York',
                'testimonial_text' => 'LV_Clicks captured our wedding beautifully. Every moment was perfectly documented.',
                'rating' => 5,
                'photo_path' => '/assets/img/testimonial/1.jpg',
                'is_featured' => true,
                'is_active' => true,
                'order' => 1,
            ],
            [
                'customer_name' => 'Helen Jordan',
                'location' => 'Chicago',
                'testimonial_text' => 'Professional service and amazing results. Highly recommended!',
                'rating' => 5,
                'photo_path' => '/assets/img/testimonial/2.jpg',
                'is_featured' => true,
                'is_active' => true,
                'order' => 2,
            ],
            [
                'customer_name' => 'Helen Jordan',
                'location' => 'New York',
                'testimonial_text' => 'The team was amazing and the photos exceeded our expectations.',
                'rating' => 5,
                'photo_path' => '/assets/img/testimonial/3.jpg',
                'is_featured' => true,
                'is_active' => true,
                'order' => 3,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::updateOrCreate(
                ['customer_name' => $testimonial['customer_name'], 'location' => $testimonial['location']],
                $testimonial
            );
        }
    }
}

