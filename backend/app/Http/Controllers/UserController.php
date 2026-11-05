<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // 1. Inisiasi query ke tabel users
        $query = User::query();

        // 2. Cek apakah ada request filter role (misal: ?role=admin)
        if ($request->has('role')) {
            $query->where('role', $request->query('role'));
        }

        // 3. Ambil datanya (Pilih kolom yang dibutuhkan saja agar ringan)
        $users = $query->select('id', 'name', 'email', 'role')->get();

        // 4. Kembalikan sebagai JSON untuk dibaca oleh React (Axios)
        return response()->json($users);
    }
}