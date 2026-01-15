<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class OwnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owners = [
            [
                'name' => 'John Apartment Owner',
                'email' => 'owner1@example.com',
                'password' => Hash::make('password'),
                'user_type' => 'owner',
            ],
            [
                'name' => 'Sarah Property Manager',
                'email' => 'owner2@example.com',
                'password' => Hash::make('password'),
                'user_type' => 'owner',
            ],
        ];

        foreach ($owners as $owner) {
            User::updateOrCreate(['email' => $owner['email']], $owner);
        }
    }
}
