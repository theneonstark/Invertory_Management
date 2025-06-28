<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExpenseController extends Controller
{

    /**
     * Display a listing of expenses.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $expenses = Expense::orderBy('expense_date', 'desc')->get();

            return response()->json([
                'success' => true,
                'message' => 'Expenses retrieved successfully',
                'data' => $expenses
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Expense fetch failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch expenses',
                'error' => env('APP_DEBUG', false) ? $e->getMessage() : 'An unexpected error occurred'
            ], 500);
        }
    }

    /**
     * Display the specified expense.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $expense = Expense::findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Expense retrieved successfully',
                'data' => $expense
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Expense not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Expense show failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve expense',
                'error' => env('APP_DEBUG', false) ? $e->getMessage() : 'An unexpected error occurred'
            ], 500);
        }
    }
}