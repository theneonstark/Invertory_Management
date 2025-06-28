<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salary extends Model
{
    protected $fillable = ['id','user_id', 'account_number', 'ifsc_code', 'bank_name', 'branch', 'salary_amount', 'allowance', 'deduction', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

     public function getUpdatedAtAttribute($value){
        return date('d M y - h:i A', strtotime($value));
    }

    public function getCreatedAtAttribute($value){
        return date('d M y - h:i A', strtotime($value));
    }
}
