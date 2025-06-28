<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderpaymentLog extends Model
{
    use HasFactory;

    // Specify the custom table name if necessary
    protected $table = 'orderpayment_logs';

    protected $fillable = [
        'order_id',
        'user_id',
        'payment_amount',
    ];
}
