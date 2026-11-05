<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Akun TEKNISI (Super Admin)
        // Akun ini yang akan Anda pakai login di tab "Teknisi"
        User::create([
            'name' => 'Super Teknisi',
            'email' => 'teknisi@disdikbud.palu.go.id',
            'password' => Hash::make('TeknisiPalu2026!'), // Password aman
            'role' => 'teknisi',
        ]);
    }
}