<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Berita;
use Illuminate\Support\Str;

class GenerateSlug extends Command
{
    protected $signature = 'generate:slug';
    protected $description = 'Generate slug untuk semua berita';

    public function handle()
    {
        Berita::all()->each(function ($b) {
            $b->slug = Str::slug($b->judul);
            $b->save();
        });

        $this->info('Slug berhasil dibuat untuk semua berita.');
    }
}
