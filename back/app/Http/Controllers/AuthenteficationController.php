<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

class AuthenteficationController extends Controller
{
    public function register(Request $request)
    {
        try {
            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                "first_name" => "required|string|max:255",
                "last_name" => "required|string|max:255",
                "role" => "required|string|max:255",
                "email" => "required|string|email|max:255|unique:users",
                "password" => "required|string|min:8",
            ]);

            // Check if the validation fails
            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422); // 422: Unprocessable Entity
            }

            // Create a new user with the provided data
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'role' => $request->role,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Generate token
            $token = $user->createToken("API TOKEN")->plainTextToken;

            // Store the token in the rememberToken column
            $user->forceFill([
                'remember_token' => $token,
            ])->save();

            $authUser = User::find($user->id);

            // Return a success response with the token
            return response()->json([
                'status' => true,
                'message' => 'User registered successfully',
                'token' => $token,
                'Admin informationF'=>$authUser
            ], 201); // 201: Created
        } catch (\Throwable $th) {
            // Handle exceptions
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500); // 500: Internal Server Error
        }
    }
}
