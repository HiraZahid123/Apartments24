<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Apartment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ApartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owner = User::where('user_type', 'owner')->first();

        if ($owner) {
            $apartments = [
                [
                    'name' => 'Sunset View Loft',
                    'address' => '123 Sky St, Downtown',
                    'city' => 'Tallinn',
                    'instructions' => 'The keybox is located next to the main entrance. Code: 1234.',
                    'arrival_url' => Str::random(10),
                    'owner_id' => $owner->id,
                ],
                [
                    'name' => 'Modern City Studio',
                    'address' => '456 Urban Ave',
                    'city' => 'Tallinn',
                    'instructions' => 'Please use the digital key sent to your email.',
                    'arrival_url' => Str::random(10),
                    'owner_id' => $owner->id,
                ],
            ];

            foreach ($apartments as $apt) {
                Apartment::create($apt);
            }
        }
    }
}
