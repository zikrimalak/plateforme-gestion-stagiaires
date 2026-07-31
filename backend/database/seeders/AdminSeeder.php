<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Compte;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'nom' => 'Admin',
            'prenom' => 'HCP',
            'email' => 'admin@hcp.ma',
            'password' => Hash::make('admin2026'),
            'role' => 'admin',
        ]);

        Compte::create([
            'user_id' => $user->id,
            'statut' => 'actif',
        ]);
    }
}