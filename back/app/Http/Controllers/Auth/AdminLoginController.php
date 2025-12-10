<?php

// AdminLoginController.php
namespace App\Http\Controllers\Auth;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Models\LogLogins;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminLoginController extends Controller
{

    public function login(Request $request)
    {
        try {
            $validateUser = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if ($validateUser->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $validateUser->errors(),
                ], 422);
            }

            if (!Auth::attempt($request->only(['email', 'password']))) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email & Password do not match our records.',
                ], 401);
            }

            $user = User::where('email', $request->email)->first();


            // Generate and store a unique token with expiration time set to 1 day
            $loginToken = $user->createToken("API TOKEN", ['expires_in' => 1440])->plainTextToken;

            // Store the token in the remember_token column of the user
            $user->forceFill([
                'remember_token' => $loginToken,
            ])->save();

            $authUser = User::find($user->id);

            if($user->role == "employee"){
                $log = new LogLogins();
                $log->user_id = $user->id;
                $log->action = 'Login';
                $log->save();
            }

            if ($user->role == "employee") {
                return response()->json([
                    'status' => true,
                    'message' => 'employee logged in successfully',
                    'token' => $loginToken,
                    'user' => $authUser,
                    'log' => $log,
                ], 200);
            }

            if ($user->role == "admin") {
                return response()->json([
                    'status' => true,
                    'message' => 'Admin logged in successfully',
                    'token' => $loginToken,
                    'user' => $authUser
                ], 200);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {

            $user = auth()->user();

            if($user->role == "employee"){
                $log = new LogLogins();
                $log->user_id = $user->id;
                $log->action = 'Logout';
                $log->save();
            }

            $request->user()->currentAccessToken()->delete();

            if ($user->role == "admin") {
                return response()->json([
                    'status' => true,
                    'message' => 'Admin logged out successfully',
                ], 200);
            }

            if ($user->role == "employee") {
                return response()->json([
                    'status' => true,
                    'message' => 'Employee logged out successfully',
                    'log' => $log,
                ], 200);
            }


        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
