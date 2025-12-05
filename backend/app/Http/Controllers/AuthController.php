<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle user login and return Sanctum token
     */
    public function login(Request $request)
    {
        // Validasi input
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Cari user berdasarkan email
        $user = User::where('email', $credentials['email'])->first();

        // Jika user tidak ada atau password salah, kembalikan error
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Login gagal, email atau password salah.'
            ], 401);
        }

        // Buat token Sanctum
        $token = $user->createToken('api-token')->plainTextToken;

        // Kembalikan respon JSON
        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    /**
     * Logout: Revoke current token
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

    /**
     * Contoh endpoint: Get user data (pakai middleware auth:sanctum)
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
