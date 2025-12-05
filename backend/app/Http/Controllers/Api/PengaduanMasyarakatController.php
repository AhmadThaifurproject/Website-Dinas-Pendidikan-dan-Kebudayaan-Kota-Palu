<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PengaduanMasyarakat;

class PengaduanMasyarakatController extends Controller
{
    public function index()
    {
        $laporan = PengaduanMasyarakat::orderBy('created_at', 'desc')->get();
        return response()->json($laporan);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string',
            'kontak' => 'required|string',
            'jenis_pemohon' => 'required|string',
            'judul' => 'required|string',
            'isi_laporan' => 'required|string',
            'identitas' => 'nullable|file|mimes:jpg,png,pdf',
            'dokumenOrganisasi' => 'nullable|file|mimes:pdf,doc,docx',
            'buktiPendukung' => 'nullable|file|mimes:jpg,png,pdf,doc,docx,mp4,mp3',
        ]);

        if ($request->hasFile('identitas')) {
            $data['identitas_path'] = $request->file('identitas')->store('pengaduan/identitas', 'public');
        }

        if ($request->hasFile('dokumenOrganisasi')) {
            $data['dokumen_organisasi_path'] = $request->file('dokumenOrganisasi')->store('pengaduan/organisasi', 'public');
        }

        if ($request->hasFile('buktiPendukung')) {
            $data['bukti_pendukung_path'] = $request->file('buktiPendukung')->store('pengaduan/bukti', 'public');
        }

        $laporan = PengaduanMasyarakat::create($data);

        return response()->json([
            'message' => 'Laporan berhasil dikirim',
            'data' => $laporan
        ]);
    }

    public function tanggapi(Request $request, $id)
    {
        $request->validate([
            'tanggapan' => 'required|string',
            'status' => 'required|string',
        ]);

        $laporan = PengaduanMasyarakat::findOrFail($id);
        $laporan->update([
            'tanggapan' => $request->tanggapan,
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Tanggapan berhasil dikirim',
            'data' => $laporan
        ]);
    }

    public function show($id)
    {
        $laporan = PengaduanMasyarakat::findOrFail($id);
        return response()->json($laporan);
    }
}
