<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductName extends Model {
    use HasFactory;

    protected $table = 'products_name'; // Ensure correct table name

    protected $fillable = [
        'name',
        'category_id',
    ];
}
