<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogLogins extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', // Add product_id to the fillable attributes
        'action',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
