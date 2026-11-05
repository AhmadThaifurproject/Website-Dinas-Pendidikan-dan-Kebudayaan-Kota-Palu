<?php

namespace App\Http\Controllers;

use App\Models\FeatureLockTeknisi;
use Illuminate\Http\Request;

class FeatureLockTeknisiController extends Controller
{
    // Fungsi untuk membaca status & catatan gembok
    public function index(Request $request)
    {
        $adminId = $request->query('admin_id');
        $bidang = $request->query('bidang');
        $layanan = $request->query('layanan');

        $locks = FeatureLockTeknisi::where('bidang', $bidang)
            ->where('layanan', $layanan)
            ->whereIn('admin_id', [$adminId, 'all'])
            ->get();

        // Format data: { "portal": { "is_locked": true, "catatan": "Perbaikan..." } }
        $formattedLocks = [];
        foreach ($locks as $lock) {
            $formattedLocks[$lock->fitur_id] = [
                'is_locked' => (bool) $lock->is_locked,
                'catatan' => $lock->catatan
            ];
        }

        return response()->json($formattedLocks);
    }

    // Fungsi untuk menyimpan Toggle & Catatan dari Teknisi
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'admin_id' => 'required|string',
            'bidang'   => 'required|string',
            'layanan'  => 'required|string',
            'fitur_id' => 'required|string',
            'is_locked'=> 'required|boolean',
            'catatan'  => 'nullable|string' // Validasi catatan tambahan
        ]);

        $lock = FeatureLockTeknisi::updateOrCreate(
            [
                'admin_id' => $validated['admin_id'],
                'bidang'   => $validated['bidang'],
                'layanan'  => $validated['layanan'],
                'fitur_id' => $validated['fitur_id'],
            ],
            [
                'is_locked' => $validated['is_locked'],
                // Jika digembok, simpan catatan. Jika dibuka, kosongkan catatannya.
                'catatan'   => $validated['is_locked'] ? $validated['catatan'] : null
            ]
        );

        return response()->json([
            'message' => 'Status kunci Teknisi berhasil diperbarui',
            'data'    => $lock
        ], 200);
    }
}