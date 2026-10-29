<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorshipSchedule extends Model
{
    //
    protected $fillable = [
        'title', 'category', 'event_date', 'start_time', 'location', 'preacher_name', 'created_by',
    ];

    protected $casts = [
        'event_date' => 'date',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scheduleRosters(): HasMany
    {
        return $this->hasMany(ScheduleRoster::class, 'schedule_id');
    }
}
