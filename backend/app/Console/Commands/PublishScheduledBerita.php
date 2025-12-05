<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Berita;           // ✅ tambahkan ini
use Carbon\Carbon;               // (optional) jika butuh manipulasi tanggal

class PublishScheduledBerita extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:publish-scheduled-berita';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publish otomatis berita yang jadwalnya sudah lewat';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // ✅ Cari berita status draft dengan jadwal <= waktu sekarang
        $count = Berita::where('status', 'draft')
            ->whereNotNull('jadwal')
            ->where('jadwal', '<=', now())
            ->update(['status' => 'publik']);

        // Tampilkan pesan di terminal/log
        $this->info("{$count} berita berhasil dipublish otomatis.");
    }
}
