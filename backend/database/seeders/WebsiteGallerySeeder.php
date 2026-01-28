<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Website\Gallery;

class WebsiteGallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Current static data from website/website_react/src/pages/Gallery.jsx
        // galleryImages array
        $gallery = [
            [
                'image_path' => '/assets/img/gallery/1.jpg',
                'title' => 'Gallery Image 1',
                'description' => null,
                'alt_text' => 'LV_Clicks Gallery',
                'category' => null,
                'tags' => null,
                'order' => 1,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/2.jpg',
                'title' => 'Gallery Image 2',
                'description' => null,
                'alt_text' => 'LV_Clicks Gallery',
                'category' => null,
                'tags' => null,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/3.jpg',
                'title' => 'Gallery Image 3',
                'description' => null,
                'alt_text' => 'LV_Clicks Gallery',
                'category' => null,
                'tags' => null,
                'order' => 3,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/4.jpg',
                'title' => 'Gallery Image 4',
                'description' => null,
                'alt_text' => 'LV_Clicks Gallery',
                'category' => null,
                'tags' => null,
                'order' => 4,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/5.jpg',
                'title' => 'Gallery Image 5',
                'description' => null,
                'alt_text' => 'LV_Clicks Gallery',
                'category' => null,
                'tags' => null,
                'order' => 5,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/6.jpg',
                'title' => 'Gallery Image 6',
                'description' => null,
                'alt_text' => 'LV_Clicks Gallery',
                'category' => null,
                'tags' => null,
                'order' => 6,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/7.jpg',
                'title' => 'Gallery Image 7',
                'description' => null,
                'alt_text' => 'LV_Clicks Gallery',
                'category' => null,
                'tags' => null,
                'order' => 7,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/8.jpg',
                'title' => 'Gallery Image 8',
                'description' => null,
                'alt_text' => 'LV_Clicks Gallery',
                'category' => null,
                'tags' => null,
                'order' => 8,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/9.jpg',
                'title' => 'Gallery Image 9',
                'description' => null,
                'alt_text' => 'LV_Clicks Gallery',
                'category' => null,
                'tags' => null,
                'order' => 9,
                'is_active' => true,
            ],
            [
                'image_path' => '/assets/img/gallery/10.jpg',
                'title' => 'Gallery Image 10',
                'description' => null,
                'alt_text' => 'LV_Clicks Gallery',
                'category' => null,
                'tags' => null,
                'order' => 10,
                'is_active' => true,
            ],
        ];

        foreach ($gallery as $item) {
            Gallery::updateOrCreate(
                ['image_path' => $item['image_path']],
                $item
            );
        }
    }
}

