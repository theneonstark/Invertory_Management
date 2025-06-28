<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;
use Illuminate\Support\Facades\Validator;

class ShopController extends Controller
{
    // Fetch all shops
    public function index()
    {
        return response()->json(Shop::all(), 200);
    }

    // Store a new shop
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'contact_number' => 'required|digits:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $shop = Shop::create($request->all());
        return response()->json(['message' => 'Shop added successfully!', 'shop' => $shop], 201);
    }

    // Update a shop
    public function update(Request $request, $id)
    {
        $shop = Shop::find($id);
        if (!$shop) {
            return response()->json(['message' => 'Shop not found'], 404);
        }

        $shop->update($request->all());
        return response()->json(['message' => 'Shop updated successfully!', 'shop' => $shop], 200);
    }

    // Delete a shop
    public function destroy($id)
    {
        $shop = Shop::find($id);
        if (!$shop) {
            return response()->json(['message' => 'Shop not found'], 404);
        }

        $shop->delete();
        return response()->json(['message' => 'Shop deleted successfully!'], 200);
    }
}
