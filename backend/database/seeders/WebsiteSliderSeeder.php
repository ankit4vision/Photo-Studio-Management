<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Website\Slider;

class WebsiteSliderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Current static data from website/website_react/src/pages/Home.jsx
        // sliderImages = [37, 38, 39, 40, 41, 38, 39, 40]
        $sliders = [
            [
                'image_path' => '/assets/img/slider/37.jpg',
                'title' => 'LV_Clicks Photography',
                'description' => 'Capturing your beautiful moments',
                'alt_text' => 'LV_Clicks Photography Slider',
                'order' => 1,
                'link_url' => null,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/slider/38.jpg',
                'title' => 'Wedding Photography',
                'description' => 'Professional wedding photography services',
                'alt_text' => 'Wedding Photography',
                'order' => 2,
                'link_url' => null,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/slider/39.jpg',
                'title' => 'Portrait Sessions',
                'description' => 'Beautiful portrait photography',
                'alt_text' => 'Portrait Photography',
                'order' => 3,
                'link_url' => null,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/slider/40.jpg',
                'title' => 'Event Coverage',
                'description' => 'Complete event photography coverage',
                'alt_text' => 'Event Photography',
                'order' => 4,
                'link_url' => null,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/slider/41.jpg',
                'title' => 'Fashion Photography',
                'description' => 'Professional fashion shoots',
                'alt_text' => 'Fashion Photography',
                'order' => 5,
                'link_url' => null,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/slider/38.jpg',
                'title' => 'Studio Sessions',
                'description' => 'Professional studio photography',
                'alt_text' => 'Studio Photography',
                'order' => 6,
                'link_url' => null,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/slider/39.jpg',
                'title' => 'Outdoor Photography',
                'description' => 'Natural outdoor photography',
                'alt_text' => 'Outdoor Photography',
                'order' => 7,
                'link_url' => null,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/slider/40.jpg',
                'title' => 'Family Portraits',
                'description' => 'Beautiful family moments',
                'alt_text' => 'Family Photography',
                'order' => 8,
                'link_url' => null,
                'is_active' => true,
            ],
        ];

        foreach ($sliders as $slider) {
            Slider::updateOrCreate(
                ['image_path' => $slider['image_path']],
                $slider
            );
        }
    }
}

