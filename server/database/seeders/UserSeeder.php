<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'first_name' => 'Daniel',
            'last_name' => 'Felix',
            'email' => 'felixdaniel2056@gmail.com',
            'password' => bcrypt('password'),
        ]);
    }
}
