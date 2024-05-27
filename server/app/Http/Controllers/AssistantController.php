<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

use App\Models\User;
use App\Models\Assistant;
use App\Models\Thread;
use App\Models\Tool;

class AssistantController extends Controller
{
    public function store(Request $request)
    {
        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found'
        ], 404);

        // check if assistant already exists
        $assistant_exists = Assistant::where('identifier', $request->assistant['id'])->orWhere('name', $request->assistant['name'])->first();
        if ($assistant_exists) return response()->json([
            'assistant' => $assistant_exists,
            'message' => 'Assistant already exists'
        ], 201);

        $assistant = Assistant::create([
            'identifier' => $request->assistant['id'],
            'name' => $request->assistant['name'],
            'slug' => Str::slug($request->assistant['name']),
            'alias' => $request->assistant['alias'],
            'instructions' => $request->assistant['instructions'],
            'model' => $request->assistant['model'],
        ]);

        return response()->json([
            'assistant' => $assistant,
            'message' => 'Assistant created successfully'
        ], 201);
    }

    /****************************************
     * Generators
    ****************************************/
    public function textGenerator()
    {
        $assistant = Assistant::where('name', 'Text Generator')->first();
        return response()->json([
            'assistant' => $assistant
        ], 200);
    }

    public function imageGenerator()
    {
        $assistant = Assistant::where('name', 'Image Generator')->first();
        return response()->json([
            'assistant' => $assistant
        ], 200);
    }

    public function videoGenerator()
    {
        $assistant = Assistant::where('name', 'Video Generator')->first();
        return response()->json([
            'assistant' => $assistant
        ], 200);
    }

    public function textToSpeech()
    {
        $assistant = Assistant::where('name', 'Text to Speech')->first();
        return response()->json([
            'assistant' => $assistant
        ], 200);
    }

    /****************************************
     * Editors
    ***************************************/
    public function photoEditor()
    {
        $assistant = Assistant::where('name', 'Photo Editor')->first();
        return response()->json([
            'assistant' => $assistant
        ], 200);
    }
}
