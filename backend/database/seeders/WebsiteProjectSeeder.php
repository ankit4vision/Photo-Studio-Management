<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Website\Project;

class WebsiteProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Current static data from website/website_react/src/pages/Home.jsx
        // projects array
        $projects = [
            [
                'title' => 'Bright Boho Sunshine',
                'author' => 'Jonathon Willson',
                'thumbnail_image' => '/assets/img/project/1.jpg',
                'album_id' => null,
                'category' => 'Wedding',
                'tags' => ['wedding', 'boho', 'outdoor'],
                'is_featured' => true,
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title' => 'California Fall Collection 2023',
                'author' => 'Jonathon Willson',
                'thumbnail_image' => '/assets/img/project/2.jpg',
                'album_id' => null,
                'category' => 'Fashion',
                'tags' => ['fashion', 'fall', 'collection'],
                'is_featured' => true,
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title' => 'Brown girl next door',
                'author' => 'Jonathon Willson',
                'thumbnail_image' => '/assets/img/project/3.jpg',
                'album_id' => null,
                'category' => 'Portrait',
                'tags' => ['portrait', 'lifestyle'],
                'is_featured' => true,
                'is_active' => true,
                'order' => 3,
            ],
            [
                'title' => 'Fashion next stage',
                'author' => 'Jonathon Willson',
                'thumbnail_image' => '/assets/img/project/4.jpg',
                'album_id' => null,
                'category' => 'Fashion',
                'tags' => ['fashion', 'editorial'],
                'is_featured' => true,
                'is_active' => true,
                'order' => 4,
            ],
            [
                'title' => 'Jenifer in green',
                'author' => 'Jonathon Willson',
                'thumbnail_image' => '/assets/img/project/5.jpg',
                'album_id' => null,
                'category' => 'Portrait',
                'tags' => ['portrait', 'studio'],
                'is_featured' => true,
                'is_active' => true,
                'order' => 5,
            ],
            [
                'title' => 'Sunflower Boho girl',
                'author' => 'Jonathon Willson',
                'thumbnail_image' => '/assets/img/project/6.jpg',
                'album_id' => null,
                'category' => 'Wedding',
                'tags' => ['wedding', 'boho', 'outdoor'],
                'is_featured' => true,
                'is_active' => true,
                'order' => 6,
            ],
            [
                'title' => 'Iceland girl',
                'author' => 'Jonathon Willson',
                'thumbnail_image' => '/assets/img/project/7.jpg',
                'album_id' => null,
                'category' => 'Travel',
                'tags' => ['travel', 'portrait', 'landscape'],
                'is_featured' => true,
                'is_active' => true,
                'order' => 7,
            ],
            [
                'title' => 'Summer sadness',
                'author' => 'Jonathon Willson',
                'thumbnail_image' => '/assets/img/project/8.jpg',
                'album_id' => null,
                'category' => 'Portrait',
                'tags' => ['portrait', 'emotional'],
                'is_featured' => true,
                'is_active' => true,
                'order' => 8,
            ],
            [
                'title' => 'Festive mode one',
                'author' => 'Jonathon Willson',
                'thumbnail_image' => '/assets/img/project/9.jpg',
                'album_id' => null,
                'category' => 'Event',
                'tags' => ['event', 'festival', 'celebration'],
                'is_featured' => true,
                'is_active' => true,
                'order' => 9,
            ],
            [
                'title' => 'Bright Boho Sunshine0',
                'author' => 'Jonathon Willson',
                'thumbnail_image' => '/assets/img/project/10.jpg',
                'album_id' => null,
                'category' => 'Wedding',
                'tags' => ['wedding', 'boho'],
                'is_featured' => false,
                'is_active' => true,
                'order' => 10,
            ],
        ];

        foreach ($projects as $project) {
            Project::updateOrCreate(
                ['title' => $project['title']],
                $project
            );
        }
    }
}

