<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Website\GalleryVideo;

class WebsiteGalleryVideoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Current static data from website/website_react/src/pages/Gallery.jsx
        $videos = [
            [
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'platform' => 'youtube',
                'title' => 'Photography Session',
                'description' => null,
                'thumbnail_path' => '/assets/img/background/bg-3.jpg',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'platform' => 'youtube',
                'title' => 'Wedding Highlights',
                'description' => null,
                'thumbnail_path' => '/assets/img/background/bg-3.jpg',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'platform' => 'youtube',
                'title' => 'Portrait Session',
                'description' => null,
                'thumbnail_path' => '/assets/img/background/bg-3.jpg',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'video_url' => 'https://vimeo.com/123456789',
                'platform' => 'vimeo',
                'title' => 'Event Coverage',
                'description' => null,
                'thumbnail_path' => '/assets/img/background/bg-3.jpg',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'platform' => 'youtube',
                'title' => 'Fashion Shoot',
                'description' => null,
                'thumbnail_path' => '/assets/img/background/bg-3.jpg',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'platform' => 'youtube',
                'title' => 'Behind The Scenes',
                'description' => null,
                'thumbnail_path' => '/assets/img/background/bg-3.jpg',
                'order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($videos as $video) {
            GalleryVideo::updateOrCreate(
                ['video_url' => $video['video_url']],
                $video
            );
        }
    }
}

