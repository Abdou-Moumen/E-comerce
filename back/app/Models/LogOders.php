<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogOders extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', // Add product_id to the fillable attributes
        'oder_id',
        'action',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Orders::class);
    }
}
