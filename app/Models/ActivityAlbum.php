<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ActivityAlbum extends Model
{
    //
    protected $fillable = [
        'title',
        'event_date',
        'description',
        'cover_photo_path',
        'created_by',
    ];

    protected $casts = [
        'event_date' => 'date',
    ];

    public function activityPhotos(): HasMany
    {
        return $this->hasMany(ActivityPhoto::class, 'album_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
