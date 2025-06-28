<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // Specify the table name (optional if the table name is pluralized version of the model)
    protected $table = 'userorders';

    // The attributes that are mass assignable
    protected $fillable = [
        'user_name',
        'user_email',
        'user_phone',
        'user_address',
        'user_city',
        'user_zip',
        'user_id',
        'created_at',
        'delivered_date',
        'total_amount',
        'paid_payment',
        'pending_payment',
        'updated_at',
        'pickup_time',
        'billing_number',
        'shipping_address',
        
    ];

    // Cast the 'products' field to an array
    protected $casts = [
        'products' => 'array',  // Automatically cast the 'products' field to an array
    ];

    // Define the relationship between Order and OrderpaymentLog
    public function paymentLogs()
    {
        return $this->hasMany(OrderpaymentLog::class, 'order_id');
    }
}
