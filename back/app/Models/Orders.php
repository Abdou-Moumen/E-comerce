<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;


    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
    public function products()
    {
        return $this->belongsToMany(Product::class);
    }

    public function employeeCycle()
    {
        return $this->hasMany(EmployeeCycle::class);
    }

    public function productOrders()
    {
        return $this->hasMany(ProductOrder::class, 'order_id');
    }
}
