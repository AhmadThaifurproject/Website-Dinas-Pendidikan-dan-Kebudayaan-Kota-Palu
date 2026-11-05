<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // =========================================================================
    // 1. REGISTER (Tetap menggunakan token jika untuk pendaftaran awal)
    // =========================================================================
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'admin', 
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil. Silakan login.',
            'user'    => $user,
        ], 201);
    }

    // =========================================================================
    // 2. LOGIN (UPDATE: COOKIE-BASED AUTH)
    // =========================================================================
    public function login(Request $request) 
    {
        // Validasi input
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
            'role'     => 'required|in:admin,teknisi'
        ]);

        // 1. Cek Kredensial (Email & Password)
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            
            $user = Auth::user();

            // 2. Cek Role (Keamanan Tambahan)
            if ($user->role !== $request->role) {
                Auth::logout(); // Logout jika role tidak sesuai
                return response()->json([
                    'message' => 'Akun Anda tidak terdaftar sebagai ' . ucfirst($request->role)
                ], 403);
            }

            // 3. Regenerate Session (Mencegah Session Fixation)
            $request->session()->regenerate();

            return response()->json([
                'message' => 'Login Berhasil',
                'user'    => $user
            ], 200);
        }

        return response()->json([
            'message' => 'Email atau kata sandi salah.'
        ], 401);
    }

    // =========================================================================
    // 3. LOGOUT (UPDATE: SESSION REVOKE)
    // =========================================================================
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout berhasil']);
    }

    // =========================================================================
    // 4. ME (Cek Session Aktif)
    // =========================================================================
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}