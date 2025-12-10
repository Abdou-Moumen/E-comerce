<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function uploadImage(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Store the uploaded image
        $imagePath = $request->file('image')->store('public/images');

        // Extract the file name from the path
        $imageName = basename($imagePath);

        return response()->json(['image_url' => asset('storage/images/' . $imageName)]);
    }
}
