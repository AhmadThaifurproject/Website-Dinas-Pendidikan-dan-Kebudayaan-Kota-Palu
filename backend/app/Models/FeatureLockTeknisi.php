<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeatureLockTeknisi extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'bidang',
        'layanan',
        'fitur_id',
        'is_locked',
        'catatan',
    ];
}