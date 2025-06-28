<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function getAllOrders(Request $request)
    {
        // Fetch all orders along with related order payment logs
        $orders = Order::select(
                'id',
                'user_id',
                'user_name',
                'user_email',
                'user_phone',
                'user_address',
                'user_city',
                'user_zip',
                'paid_payment',
                'total_amount',
                'pending_payment',
                'products',
                'created_at',
                'updated_at',
                'delivered_date',
                'status',
                'pickup_time',
                'billing_number',
                'shipping_address',
                
            )
            ->with('paymentLogs') // Eager load the related OrderpaymentLogs
            ->orderBy('created_at', 'desc')
            ->get();

        // Decode the JSON `products` field
        $orders->transform(function ($order) {
            $order->products = json_decode($order->products, true);
            return $order;
        });

        // Return the orders along with their payment logs as JSON
        return response()->json(['userorders' => $orders], 200);
    }

    public function update(Request $request, $id)
    {
        try {
            // Find the order
            $order = Order::findOrFail($id);

            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                'user_email' => 'required|email|max:255',
                'user_phone' => 'required|string|max:20',
                'user_address' => 'required|string|max:255',
                'user_city' => 'required|string|max:100',
                'user_zip' => 'required|string|max:20',
                'created_at' => 'required|date',
                'delivered_date' => 'nullable|date',
                'total_amount' => 'required|numeric|min:0',
                'paid_payment' => 'required|numeric|min:0',
                'pending_payment' => 'required|numeric|min:0',
                'billing_number' => 'required|numeric|min:0',
                'pickup_time' => 'required',
                'shipping_address' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update order data
            $order->user_email = $request->user_email;
            $order->user_phone = $request->user_phone;
            $order->user_address = $request->user_address;
            $order->user_city = $request->user_city;
            $order->user_zip = $request->user_zip;
            $order->created_at = $request->created_at;
            $order->delivered_date = $request->delivered_date;
            $order->total_amount = $request->total_amount;
            $order->paid_payment = $request->paid_payment;
            $order->pending_payment = $request->pending_payment;
            $order->billing_number = $request->billing_number;
            $order->pickup_time = $request->pickup_time;
            $order->shipping_address = $request->shipping_address;
            $order->updated_at = now();

            // Validate payment amounts
            if ($order->total_amount != ($order->paid_payment + $order->pending_payment)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Total amount must equal paid plus pending payment'
                ], 422);
            }

            $order->save();

            // Return the updated order
            return response()->json([
                'success' => true,
                'message' => 'Order updated successfully',
                'data' => $order
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
