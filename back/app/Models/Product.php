<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', // Add category_id to the fillable attributes
        'product_name',
        'description',
        'price',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function discounts()
    {
        return $this->hasMany(Discount::class);
    }

    public function orderitems()
    {
        return $this->hasMany(ProductOrder::class);
    }

    public function poductimages()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function poductcolors()
    {
        return $this->hasMany(ProductColor::class);
    }

    public function sizes()
    {
        return $this->hasMany(Size::class);
    }

    public function orders()
    {
        return $this->belongsToMany(Orders::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function quantity()
    {
        return $this->hasOne(Quantity::class);
    }

}
