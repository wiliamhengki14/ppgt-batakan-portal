<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FinancialLedger extends Model
{
    //
    protected $guarded = ['id'];
    protected $casts = [
        'transaction_date' => 'date',
        'amount' => 'decimal:2',
    ];
    public function creator() {
        return $this->belongsTo(User::class, 'created_by');
    }
}
