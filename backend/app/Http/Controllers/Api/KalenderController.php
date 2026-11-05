<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kalender;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class KalenderController extends Controller
{
    /**
     * Menampilkan semua daftar agenda kalender.
     */
    public function index()
    {
        return response()->json(Kalender::orderBy('id', 'desc')->get());
    }

    /**
     * Menyimpan agenda baru ke database.
     */
    public function store(Request $request)
    {
        // Validasi input dengan batas gambar 10MB
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'date'        => 'required|string',
            'color'       => 'required|string',
            'category'    => 'required|string',
            'location'    => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg|max:10240', // 10MB
        ]);

        $data = $request->all();

        // Logika simpan gambar ke storage/app/public/kalender
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('kalender', 'public');
            $data['image'] = $path;
        }

        $kalender = Kalender::create($data);

        return response()->json($kalender, 201);
    }

    /**
     * Memperbarui data agenda yang sudah ada.
     */
    public function update(Request $request, $id)
    {
        $kalender = Kalender::findOrFail($id);

        // Validasi pembaruan dengan batas gambar 10MB
        $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg|max:10240', // 10MB
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada untuk menghemat ruang storage
            if ($kalender->image) {
                Storage::disk('public')->delete($kalender->image);
            }
            
            // Simpan gambar baru
            $path = $request->file('image')->store('kalender', 'public');
            $data['image'] = $path;
        }

        $kalender->update($data);

        return response()->json($kalender);
    }

    /**
     * Menghapus agenda dari database dan file fisiknya di storage.
     */
    public function destroy($id)
    {
        $kalender = Kalender::findOrFail($id);

        // Hapus file gambar dari storage sebelum menghapus record database
        if ($kalender->image) {
            Storage::disk('public')->delete($kalender->image);
        }

        $kalender->delete();

        return response()->json([
            'message' => 'Agenda berhasil dihapus secara permanen.'
        ]);
    }
}