<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', 'AuthController@register');
Route::post('/login', 'AuthController@login');

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::prefix('user')->group(function () {
        Route::get('/', function (Request $request) {
            return $request->user();
        });

        Route::get('/{id}', 'UserController@show');
        Route::put('/{id}', 'UserController@update');
        Route::delete('/{id}', 'UserController@destroy');
    });
});