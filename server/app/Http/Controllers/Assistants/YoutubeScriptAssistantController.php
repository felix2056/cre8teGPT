<?php

namespace App\Http\Controllers\Assistants;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Assistants\YoutubeScriptAssistant;
use Illuminate\Support\Facades\Auth;

class YoutubeScriptAssistantController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'channel_id' => 'nullable|string',
            'topic' => 'required|string',
            'angle' => 'required|string',
            'audience' => 'required|string',
            'goal' => 'required|string',
            'scriptNumber' => 'required|integer',
            'language' => 'required|string',
            'length' => 'required|integer',
            'format' => 'required|string',
            'research' => 'required|in:basic,intermediate,comprehensive,exhaustive',
        ]);

        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found'
        ], 401);

        $youtubeScriptAssistant = $user->youtubeScripts()->create([
            'channel' => $request->channel_id,
            'topic' => $request->topic,
            'angle' => $request->angle,
            'audience' => $request->audience,
            'goal' => $request->goal,
            'number' => $request->scriptNumber,
            'language' => $request->language,
            'length' => $request->length,
            'format' => $request->format,
            'research' => $request->research,
        ]);

        return response()->json([
            'message' => 'Youtube script assistant created',
            'youtubeScriptAssistant' => $youtubeScriptAssistant,
        ]);
    }
}
