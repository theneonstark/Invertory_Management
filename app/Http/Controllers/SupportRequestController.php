<?php

namespace App\Http\Controllers;

use App\Models\SupportRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupportRequestController extends Controller
{
    // Get all support requests
    public function index()
    {
        $requests = SupportRequest::orderBy('created_at', 'desc')->get();
        return response()->json($requests);
    }

    // Update support request status
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,in_progress,resolved'
        ]);

        $supportRequest = SupportRequest::findOrFail($id);
        $supportRequest->status = $request->status;
        $supportRequest->save();

        return response()->json([
            'message' => 'Status updated successfully',
            'data' => $supportRequest
        ]);
    }
}