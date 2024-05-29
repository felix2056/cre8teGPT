<?php

namespace Database\Seeders;

use App\Models\PricingPlan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PricingPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pricingPlans = [
            [
                'name' => 'Free',
                'slug' => 'free',
                'description' => 'Free forever',
                'price' => 0,
                'duration' => 1,
                'duration_unit' => 'month',
                'order' => 1,
                'is_featured' => false,
                'is_active' => true,
                'features' => [
                    '10 Cre8dits / month',
                    'Content generators',
                    'Community access',
                    'Limited support',
                ],
            ],
            [
                'name' => 'Basic',
                'slug' => 'basic',
                'description' => 'Basic plan',
                'price' => 14.99,
                'duration' => 1,
                'duration_unit' => 'month',
                'order' => 2,
                'is_featured' => false,
                'is_active' => true,
                'features' => [
                    '149 Cre8dits / month',
                    'Content generators',
                    'Content editors',
                    'Content planners',
                    'Community access',
                    'Basic support',
                ],
            ],
            [
                'name' => 'Cre8tor',
                'slug' => 'cre8tor',
                'description' => 'Cre8tor plan',
                'price' => 29.99,
                'duration' => 1,
                'duration_unit' => 'month',
                'order' => 3,
                'is_featured' => true,
                'is_active' => true,
                'features' => [
                    '299 Cre8dits / month',
                    'Content generators',
                    'Content editors',
                    'Content planners',
                    'Content analytics',
                    'Content distributors',
                    'Content collaboration',
                    'Community access',
                    'Priority support',
                ],
            ],
            [
                'name' => 'Business',
                'slug' => 'business',
                'description' => 'Business plan',
                'price' => 49.99,
                'duration' => 1,
                'duration_unit' => 'month',
                'order' => 4,
                'is_featured' => false,
                'is_active' => true,
                'features' => [
                    '499 Cre8dits / month',
                    'Content generators',
                    'Content editors',
                    'Content planners',
                    'Content analytics',
                    'Content distributors',
                    'Content collaboration',
                    'Community access',
                    'Priority support',
                ],
            ]
        ];

        foreach ($pricingPlans as $pricingPlan) {
            PricingPlan::create($pricingPlan);
        }
    }
}
