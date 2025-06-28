<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // Login method
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        // Find user by email
        $user = User::where('email', $validated['email'])->first();
    
        // Check if user exists and password matches
        if ($user && Hash::check($validated['password'], $user->password)) {
            
            // Check if user status is 1 or role is 'User'
            if ($user->role == 'Admin') {
                Auth::login($user);
    
                return response()->json([
                    'message' => 'Login successful',
                    'redirect' => '/admin/dashboard',
                ]);
            }
    
            return response()->json(['message' => 'Access denied. Unauthorized user.'], 403);
        }
    
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    // Logout method
    public function logout(Request $request)
    {
        Auth::logout();
        return Inertia::location('/');
    }


    public function getLoggedInUser(Request $request)
    {
        $user = Auth::user(); // Get the currently authenticated user
        return response()->json(['user' => $user], 200);
    }


}
