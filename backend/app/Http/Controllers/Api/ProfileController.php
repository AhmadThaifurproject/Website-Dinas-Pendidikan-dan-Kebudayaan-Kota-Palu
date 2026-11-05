<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'title' => 'required',
            // PERBAIKAN DISINI: Ubah max:10000 menjadi max:50000 agar konsisten
            'image' => 'required|image|mimes:jpeg,png,jpg|max:50000', 
            'category' => 'required|in:pimpinan,bidang',
            'description' => 'required', 
        ]);

        $path = $request->file('image')->store('profiles', 'public');

        Profile::create([
            'name' => $request->name,
            'title' => $request->title,
            'category' => $request->category,
            'description' => json_decode($request->description),
            'image' => $path
        ]);

        return response()->json(['message' => 'Berhasil']);
    }

    public function index()
    {
        return response()->json(Profile::all());
    }

    public function update(Request $request, $id)
    {
        $profile = Profile::find($id);
        
        if (!$profile) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
        
        $request->validate([
            'name' => 'required',
            // Update juga pastikan max:50000
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:50000', 
            'description' => 'required',
        ]);

        $data = [
            'name' => $request->name,
            'title' => $request->title,
            'category' => $request->category,
            'description' => json_decode($request->description),
        ];

        if ($request->hasFile('image')) {
            if($profile->image) {
                Storage::disk('public')->delete($profile->image);
            }
            $data['image'] = $request->file('image')->store('profiles', 'public');
        }

        $profile->update($data);

        return response()->json(['message' => 'Berhasil update']);
    }

    public function destroy($id)
    {
        $profile = Profile::find($id);

        if (!$profile) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        if ($profile->image) {
            Storage::disk('public')->delete($profile->image);
        }

        $profile->delete();

        return response()->json(['message' => 'Profil berhasil dihapus']);
    }
}