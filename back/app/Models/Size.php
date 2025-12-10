<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', // Add product_id to the fillable attributes
        'product_color_id',
        'size',
    ];

    public function productColor()
    {
        return $this->belongsTo(ProductColor::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function quantity()
    {
        return $this->hasOne(Quantity::class);
    }

}
