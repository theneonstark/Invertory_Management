<?php

namespace App\Http\Controllers;

use App\Models\Salary;
use Illuminate\Http\Request;

class SalaryController extends Controller
{
    public function index()
{
    $salaryData = Salary::with('user')->get()->map(function ($salary) {
        return [
            'id' => $salary->id,
            'user_name' => $salary->user ? $salary->user->name : null, // Assuming 'name' is the column in the users table
            'amount' => $salary->salary_amount, // Include other salary fields as needed
            'account_number' => $salary->account_number, // Include other salary fields as needed
            'ifsc_code' => $salary->ifsc_code, // Include other salary fields as needed
            'bank_name' => $salary->bank_name, // Include other salary fields as needed
            'branch' => $salary->branch, // Include other salary fields as needed
            'allowance' => $salary->allowance, // Include other salary fields as needed
            'deduction' => $salary->deduction, // Include other salary fields as needed
        ];
    });

    return response()->json(['message' => 'success', 'salary' => $salaryData]);
}

    public function add(Request $post){
        $data = $post->all();
        
        $salary = Salary::create([
            'user_id' => $data['userId'],
            'account_number' => $data['accountNumber'],
            'ifsc_code' => $data['ifsc_code'],
            'bank_name' => $data['bankName'],
            'branch' => $data['branch'],
            'salary_amount' => $data['basicSalary'],
            'allowance' => $data['allowances'],
            'deduction' => $data['deductions'],
            'status' => false,
        ]);

        return response()->json(['message' => 'success', 'salaryData' => $salary], 200);
    }
}
