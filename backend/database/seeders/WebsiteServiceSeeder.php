<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Website\Service;

class WebsiteServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Current static data from website/website_react/src/pages/Home.jsx
        // services array
        $services = [
            [
                'icon_class' => 'bi-camera',
                'title' => 'Wedding Photography',
                'description' => 'Complete wedding day coverage with candid and traditional photography for every important ritual.',
                'service_number' => '01',
                'order' => 1,
                'is_active' => true,
                'link_url' => null,
            ],
            [
                'icon_class' => 'bi-camera-video',
                'title' => 'Wedding Cinematography',
                'description' => 'Cinematic wedding films with storytelling, speeches, and music edits that capture real emotions.',
                'service_number' => '02',
                'order' => 2,
                'is_active' => true,
                'link_url' => null,
            ],
            [
                'icon_class' => 'bi-heart',
                'title' => 'Pre‑Wedding Shoots',
                'description' => 'Concept-based pre‑wedding sessions at outdoor locations, customized themes, and couple portraits.',
                'service_number' => '03',
                'order' => 3,
                'is_active' => true,
                'link_url' => null,
            ],
            [
                'icon_class' => 'bi-people',
                'title' => 'Portrait & Portfolio',
                'description' => 'Professional studio and outdoor portrait sessions for personal, modelling, and social media portfolios.',
                'service_number' => '04',
                'order' => 4,
                'is_active' => true,
                'link_url' => null,
            ],
            [
                'icon_class' => 'bi-camera-reels',
                'title' => 'Event Photography',
                'description' => 'Birthday, engagement, baby shower, corporate events, and family functions with full photo coverage.',
                'service_number' => '05',
                'order' => 5,
                'is_active' => true,
                'link_url' => null,
            ],
            [
                'icon_class' => 'bi-image',
                'title' => 'Baby & Maternity',
                'description' => 'Newborn, kids, and maternity sessions with creative setups, props, and safe studio lighting.',
                'service_number' => '06',
                'order' => 6,
                'is_active' => true,
                'link_url' => null,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['title' => $service['title']],
                $service
            );
        }
    }
}

