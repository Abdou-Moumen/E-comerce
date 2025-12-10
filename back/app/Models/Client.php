<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;
    public $timestamps = true;

    public function address(){
        return $this->hasOne(Address::class);
    }

    public function orders(){
        return $this->hasMany(Orders::class);
    }

    public function cart(){
        return $this->hasMany(Cart::class);
    }

}
