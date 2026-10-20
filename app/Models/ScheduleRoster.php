<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduleRoster extends Model
{
    //
    protected $fillable = [
        'schedule_id',
        'user_id',
        'role_name',
        'custom_name',
        'is_auto_assigned',
        'reminder_sent_h3',
        'reminder_sent_h1',
    ];
    protected $casts = [
        'is_auto_assigned' => 'boolean',
        'reminder_sent_h3' => 'boolean',
        'reminder_sent_h1' => 'boolean',
    ];

    public function worshipSchedule(): BelongsTo {
        return $this->belongsTo(WorshipSchedule::class, 'schedule_id');
    }
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
