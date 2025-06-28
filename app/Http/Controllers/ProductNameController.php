<?php

namespace App\Http\Controllers;

use App\Models\ProductName;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductNameController extends Controller
{
    // Function to add a product name
    public function addProductName(Request $request)
    {
        // Validate input
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|integer|exists:categories,id',
        ]);

        // Create the product name record
        $productName = ProductName::create([
            'name' => $request->name,
            'category_id' => $request->category_id,
        ]);

        return response()->json(['message' => 'Product name added successfully!', 'productName' => $productName], 201);
    }

    // Function to get all product names
    public function getAllProductNames()
    {
        $productNames = ProductName::all();
        return response()->json(['productNames' => $productNames], 200);
    }

    // Function to get a single product name by ID
    public function getProductName($id)
    {
        $productName = ProductName::find($id);

        if (!$productName) {
            return response()->json(['message' => 'Product name not found'], 404);
        }

        return response()->json(['productName' => $productName], 200);
    }

    // Function to update a product name by ID
    public function updateProductName(Request $request, $id)
    {
        $productName = ProductName::find($id);

        if (!$productName) {
            return response()->json(['message' => 'Product name not found'], 404);
        }

        // Validate input
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|integer|exists:categories,id',
        ]);

        // Update the product name
        $productName->update([
            'name' => $request->name,
            'category_id' => $request->category_id,
        ]);

        return response()->json(['message' => 'Product name updated successfully!', 'productName' => $productName], 200);
    }

    // Function to delete a product name by ID
    public function deleteProductName($id)
    {
        $productName = ProductName::find($id);

        if (!$productName) {
            return response()->json(['message' => 'Product name not found'], 404);
        }

        // Delete the product name
        $productName->delete();

        return response()->json(['message' => 'Product name deleted successfully!'], 200);
    }
}
