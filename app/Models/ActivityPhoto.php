<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityPhoto extends Model
{
    //
    protected $fillable = [
        'album_id',
        'photo_path',
        'caption',
    ];

    public function activityAlbum(): BelongsTo {
        return $this->belongsTo(ActivityAlbum::class, 'album_id');
    }
}
