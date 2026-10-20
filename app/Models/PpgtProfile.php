<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PpgtProfile extends Model
{
    //
    protected $fillable = [
        'user_id',
        'residence_type',
        'gender',
        'birth_date',
        'sector_in_batakan',
        'batakan_home_address',
        'parent_names',
        'overseas_city',
        'overseas_address',
        'overseas_purpose',
        'verification_status',
        'rejection_note',
        'verified_by',
        'verified_at',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'verified_at' => 'datetime',
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
    public function verifier(): BelongsTo {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
