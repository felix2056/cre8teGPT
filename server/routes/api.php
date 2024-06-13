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
Route::post('/after-social-login', 'AuthController@afterSocialLogin');

Route::prefix('tools')->group(function () {
    Route::get('', 'ToolController@index');
    Route::get('show/{slug}', 'ToolController@show');
    Route::get('featured', 'ToolController@featured');

    Route::prefix('generators')->group(function () {
        Route::prefix('youtube-channel-analyzer')->group(function () {
            Route::get('', 'Generators\YoutubeChannelAnalyzerController@index');
            Route::get('{channel_id}/show', 'Generators\YoutubeChannelAnalyzerController@show');

            Route::group(['middleware' => 'auth:sanctum'], function () {
                Route::post('save', 'Generators\YoutubeChannelAnalyzerController@store');
                Route::put('update/{channel_id}', 'Generators\YoutubeChannelAnalyzerController@update');
                Route::delete('delete/{channel_id}', 'Generators\YoutubeChannelAnalyzerController@destroy');
            });
        });
    });

    Route::prefix('assistants')->group(function () {
        Route::prefix('youtube-script-assistant')->group(function () {
            Route::get('', 'Assistants\YoutubeScriptAssistantController@index');
            Route::get('{script_id}/show', 'Assistants\YoutubeScriptAssistantController@show');
            Route::match(['get', 'post'], '{script_id}/framing', 'Assistants\YoutubeScriptAssistantController@framing');

            Route::group(['middleware' => 'auth:sanctum'], function () {
                Route::post('save', 'Assistants\YoutubeScriptAssistantController@store');
                Route::put('update/{script_id}', 'Assistants\YoutubeScriptAssistantController@update');
                Route::delete('delete/{script_id}', 'Assistants\YoutubeScriptAssistantController@destroy');
            });
        });
    });
});

Route::prefix('assistants')->group(function () {
    // Generators
    Route::get('text-generator', 'AssistantController@textGenerator');
    Route::get('image-generator', 'AssistantController@imageGenerator');
    Route::get('video-generator', 'AssistantController@videoGenerator');
    Route::get('text-to-speech', 'AssistantController@textToSpeech');

    // Editors
    Route::get('photo-editor', 'AssistantController@photoEditor');
});

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::prefix('user')->group(function () {
        Route::get('', function (Request $request) {
            return $request->user();
        });

        Route::put('update', 'UserController@update');
        Route::put('update/password', 'UserController@updatePassword');
        Route::delete('delete', 'UserController@destroy');
    });

    Route::prefix('assistants')->group(function () {
        Route::post('create', 'AssistantController@store');
    });

    Route::prefix('threads')->group(function () {
        Route::get('', 'ThreadController@index');
        Route::get('assistant/{slug}', 'ThreadController@assistant');
        Route::post('create', 'ThreadController@store');
        Route::get('single/{thread_id}', 'ThreadController@show');
        Route::put('{thread_id}/update', 'ThreadController@update');
        Route::delete('{thread_id}/delete', 'ThreadController@destroy');

        // Generators
        Route::prefix('{thread_id}/image-messages')->group(function () {
            Route::get('', 'ImageMessageController@index');
            Route::post('create', 'ImageMessageController@store');
        });
        Route::prefix('{thread_id}/video-messages')->group(function () {
            Route::get('', 'VideoMessageController@index');
            Route::post('create', 'VideoMessageController@store');
        });

        // Editors
        Route::prefix('{thread_id}/photo-messages')->group(function () {
            Route::get('', 'PhotoMessageController@index');
            Route::post('create', 'PhotoMessageController@store');
        });
    });
});