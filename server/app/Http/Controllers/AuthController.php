<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|max:55',
            'last_name' => 'required|max:55',
            'email' => 'email|required|unique:users',
            'password' => 'required',
            'confirm_password' => 'required|same:password'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $user = new User();
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'user' => $user,
            'message' => 'You have successfully registered 👨🏻‍💻✅. Welcome to Cre8teGPT! 🎉'
        ]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'email|required',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        // return response()->json([
        //     'attempt' => Auth::attempt($request->only('email', 'password')),
        //     'email' => $request->email,
        //     'password' => Hash::make($request->password),
        //     'message' => 'Attempting to login...'
        // ], 401);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = User::find(Auth::id());
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'user' => $user,
                'access_token' => $token,
                'message' => 'You have successfully logged in 👨🏻‍💻✅. Welcome back❗🎉'
            ]);
        }

        return response()->json([
            'message' => 'The provided credentials do not match our records. 👨🏻‍💻⛔. Try again⏳'
        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}
