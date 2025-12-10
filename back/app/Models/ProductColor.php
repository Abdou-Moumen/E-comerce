<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductColor extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        
        'color_name',
        'value',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function sizes(){
        return $this->hasMany(Size::class);
    }

    public function quantity()
    {
        return $this->hasOne(Quantity::class);
    }

}
