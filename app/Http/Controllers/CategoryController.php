<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    // Function to add a new category
    public function addCategory(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:categories,name|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate image file
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            // Store image in 'public/categories' directory and get the path
            $imagePath = $image->store('categories', 'public');
        }

        // Create new category record
        $category = Category::create([
            'name' => $request->name,
            'image' => $imagePath, // Store the image path
        ]);

        return response()->json(['message' => 'Category added successfully!', 'category' => $category], 201);
    }

    // Function to get all categories
    public function getAllCategories()
    {
        $categories = Category::all();
        return response()->json(['categories' => $categories], 200);
    }

    // Function to get a single category by ID
    public function getCategory($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json(['category' => $category], 200);
    }

    // Function to update category by ID
    public function updateCategory(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Validate input
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:categories,name,' . $id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Handle image upload
        $imagePath = $category->image; // Keep the existing image path by default
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }

            // Store the new image and get the path
            $image = $request->file('image');
            $imagePath = $image->store('categories', 'public');
        }

        // Update the category
        $category->update([
            'name' => $request->name ?? $category->name, // Use existing name if not provided
            'image' => $imagePath, // Update the image path if a new image was uploaded
        ]);

        return response()->json(['message' => 'Category updated successfully!', 'category' => $category], 200);
    }

    // Function to delete a category by ID
    public function deleteCategory($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Delete the category
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully!'], 200);
    }
}