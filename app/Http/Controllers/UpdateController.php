<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class UpdateController extends Controller
{
    /**
     * Update user details.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id  The ID of the user to update.
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateUser(Request $request, $id)
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Validate the update request
        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $user->id,
            'role'     => 'sometimes|string|max:255',
            'status'   => 'sometimes|in:0,1', // Validate that the status is either 0 or 1
          
        ]);

        // Update user fields if they are provided in the request
        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->has('role')) {
            $user->role = $request->role;
        }
        if ($request->has('status')) {
            $user->status = $request->status;
        }
        // Save updated user details
        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user'    => $user,
        ], 200);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        $user->delete();
        
        return response()->json(['message' => 'User deleted successfully'], 200);
    }


    public function updateProduct(Request $request, $id)
    {
        $request->validate([
            'productName' => 'sometimes|string|max:255',
            'companyName' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:255',
            'owned_imported' => 'sometimes|in:owned,imported',
            'price' => 'sometimes|numeric',
            'stock_quantity' => 'sometimes|integer',
            'description' => 'sometimes|string',
        ]);
    
        $product = Product::findOrFail($id);
        $product->update($request->all());
    
        return response()->json(['message' => 'Product updated successfully!', 'product' => $product], 200);
    }

    public function deleteProduct($id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        
        $product->delete();
        
        return response()->json(['message' => 'Product deleted successfully'], 200);
    }

}
