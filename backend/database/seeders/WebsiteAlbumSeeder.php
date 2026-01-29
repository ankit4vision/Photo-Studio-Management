<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Website\Album;

class WebsiteAlbumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Based on static albums from website/website_react/src/pages/OurWorks.jsx
        $albums = [
            [
                'title' => 'Wedding Album 2024',
                'description' => 'A curated collection of the best wedding moments from 2024.',
                'cover_image' => '/assets/img/projects/1/1.jpg',
                'category' => 'wedding',
                'tags' => ['wedding', '2024', 'ceremony', 'reception'],
                'event_date' => '2024-01-01',
                'is_featured' => true,
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title' => 'Portrait Session',
                'description' => 'Studio and outdoor portrait photography sessions.',
                'cover_image' => '/assets/img/projects/1/2.jpg',
                'category' => 'portrait',
                'tags' => ['portrait', 'studio', 'outdoor'],
                'event_date' => null,
                'is_featured' => false,
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title' => 'Fashion Collection',
                'description' => 'Editorial style fashion photography collection.',
                'cover_image' => '/assets/img/projects/1/3.jpg',
                'category' => 'fashion',
                'tags' => ['fashion', 'editorial', 'studio'],
                'event_date' => null,
                'is_featured' => false,
                'is_active' => true,
                'order' => 3,
            ],
            [
                'title' => 'Event Coverage 2024',
                'description' => 'Highlights from multiple events covered in 2024.',
                'cover_image' => '/assets/img/projects/1/4.jpg',
                'category' => 'event',
                'tags' => ['event', 'coverage', '2024'],
                'event_date' => '2024-01-01',
                'is_featured' => true,
                'is_active' => true,
                'order' => 4,
            ],
            [
                'title' => 'Nature Photography',
                'description' => 'A collection of breathtaking nature and landscape shots.',
                'cover_image' => '/assets/img/projects/1/5.jpg',
                'category' => 'nature',
                'tags' => ['nature', 'landscape', 'outdoor'],
                'event_date' => null,
                'is_featured' => false,
                'is_active' => true,
                'order' => 5,
            ],
            [
                'title' => 'Studio Session',
                'description' => 'Creative studio photography sessions with various themes.',
                'cover_image' => '/assets/img/projects/1/6.jpg',
                'category' => 'studio',
                'tags' => ['studio', 'portrait'],
                'event_date' => null,
                'is_featured' => false,
                'is_active' => true,
                'order' => 6,
            ],
            [
                'title' => 'Outdoor Adventure',
                'description' => 'Adventure and lifestyle photography shot on location.',
                'cover_image' => '/assets/img/projects/1/7.jpg',
                'category' => 'outdoor',
                'tags' => ['outdoor', 'adventure', 'lifestyle'],
                'event_date' => null,
                'is_featured' => false,
                'is_active' => true,
                'order' => 7,
            ],
            [
                'title' => 'Family Portrait',
                'description' => 'Warm and candid family portrait sessions.',
                'cover_image' => '/assets/img/projects/1/8.jpg',
                'category' => 'family',
                'tags' => ['family', 'portrait'],
                'event_date' => null,
                'is_featured' => false,
                'is_active' => true,
                'order' => 8,
            ],
        ];

        foreach ($albums as $index => $data) {
            // Ensure a stable order value even if not explicitly set
            if (!isset($data['order'])) {
                $data['order'] = $index + 1;
            }

            Album::updateOrCreate(
                ['title' => $data['title']],
                $data
            );
        }
    }
}


