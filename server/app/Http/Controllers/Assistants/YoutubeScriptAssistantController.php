<?php

namespace App\Http\Controllers\Assistants;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Assistants\YoutubeScriptAssistant;
use Illuminate\Support\Facades\Auth;

class YoutubeScriptAssistantController extends Controller
{
    public function show($id)
    {
        $youtubeScriptAssistant = YoutubeScriptAssistant::find($id);
        if (!$youtubeScriptAssistant) return response()->json([
            'message' => 'Youtube script assistant not found'
        ], 404);

        return response()->json([
            'topic' => $youtubeScriptAssistant->topic,
            'angle' => $youtubeScriptAssistant->angle,
            'audience' => $youtubeScriptAssistant->audience,
            'goal' => $youtubeScriptAssistant->goal,
            'scriptNumber' => $youtubeScriptAssistant->number,
            'language' => $youtubeScriptAssistant->language,
            'length' => $youtubeScriptAssistant->length,
            'format' => $youtubeScriptAssistant->format,
            'research' => $youtubeScriptAssistant->research,
        ]);
    }

    public function framing(Request $request, $id)
    {
        if ($request->isMethod('post')) {
            $request->validate([
                'framing' => 'required|array',
            ]);

            $youtubeScriptAssistant = YoutubeScriptAssistant::find($id);
            if (!$youtubeScriptAssistant) return response()->json([
                'message' => 'Youtube script assistant not found'
            ], 404);

            $youtubeScriptAssistant->update([
                'framing' => json_encode($request->framing),
            ]);

            return response()->json([
                'message' => 'Youtube script assistant updated',
                'youtubeScriptAssistant' => $youtubeScriptAssistant,
            ]);
        }
        
        $youtubeScriptAssistant = YoutubeScriptAssistant::find($id);
        if (!$youtubeScriptAssistant) return response()->json([
            'message' => 'Youtube script assistant not found'
        ], 404);

        return response()->json([
            'framing' => $youtubeScriptAssistant->framing ?? [],
        ]);
    }

    public function titles(Request $request, $id)
    {
        if ($request->isMethod('post')) {
            $request->validate([
                'titles' => 'required|array',
            ]);

            $youtubeScriptAssistant = YoutubeScriptAssistant::find($id);
            if (!$youtubeScriptAssistant) return response()->json([
                'message' => 'Youtube script assistant not found'
            ], 404);

            $youtubeScriptAssistant->update([
                'titles' => $request->titles,
            ]);

            return response()->json([
                'message' => 'Youtube script assistant updated',
                'youtubeScriptAssistant' => $youtubeScriptAssistant,
            ]);
        }
        
        $youtubeScriptAssistant = YoutubeScriptAssistant::find($id);
        if (!$youtubeScriptAssistant) return response()->json([
            'message' => 'Youtube script assistant not found'
        ], 404);

        return response()->json([
            'titles' => $youtubeScriptAssistant->titles ?? [],
        ]);
    }

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

    public function update(Request $request, $id)
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

        $youtubeScriptAssistant = YoutubeScriptAssistant::find($id);
        if (!$youtubeScriptAssistant) return response()->json([
            'message' => 'Youtube script assistant not found'
        ], 404);

        $youtubeScriptAssistant->update([
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
            'message' => 'Youtube script assistant updated',
            'youtubeScriptAssistant' => $youtubeScriptAssistant,
        ]);
    }

    public function destroy($id)
    {
        $youtubeScriptAssistant = YoutubeScriptAssistant::find($id);
        if (!$youtubeScriptAssistant) return response()->json([
            'message' => 'Youtube script assistant not found'
        ], 404);

        $youtubeScriptAssistant->delete();

        return response()->json([
            'message' => 'Youtube script assistant deleted',
        ]);
    }
}
