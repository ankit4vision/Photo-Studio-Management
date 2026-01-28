<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Website\HomeGallery;

class WebsiteHomeGallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Current static data from website/website_react/src/pages/Home.jsx
        // galleryImages = [1, 2, 3, 4, 5, 6]
        $gallery = [
            [
                'image_path' => '/assets/img/gallery/1.jpg',
                'title' => 'Gallery Image 1',
                'alt_text' => 'LV_Clicks Gallery',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/2.jpg',
                'title' => 'Gallery Image 2',
                'alt_text' => 'LV_Clicks Gallery',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/3.jpg',
                'title' => 'Gallery Image 3',
                'alt_text' => 'LV_Clicks Gallery',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/4.jpg',
                'title' => 'Gallery Image 4',
                'alt_text' => 'LV_Clicks Gallery',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/5.jpg',
                'title' => 'Gallery Image 5',
                'alt_text' => 'LV_Clicks Gallery',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/6.jpg',
                'title' => 'Gallery Image 6',
                'alt_text' => 'LV_Clicks Gallery',
                'order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($gallery as $item) {
            HomeGallery::updateOrCreate(
                ['image_path' => $item['image_path']],
                $item
            );
        }
    }
}

