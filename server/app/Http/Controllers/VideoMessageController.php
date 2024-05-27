<?php

namespace App\Http\Controllers;

use App\Models\VideoMessage;
use Illuminate\Http\Request;

class VideoMessageController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'thread_id' => 'required',
            'user_id' => 'required',
            'videos' => 'required',
            'content' => 'required',
        ]);

        $video_message = VideoMessage::create([
            'thread_id' => $request->thread_id,
            'user_id' => $request->user_id,
            'videos' => json_encode($request->videos),
            'content' => json_encode($request->content),
        ]);

        return response()->json([
            'video_message' => $video_message,
            'message' => 'Video message created successfully'
        ], 201);
    }
}
