<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ImageMessage;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Orhanerday\OpenAi\OpenAi;

class ImageMessageController extends Controller
{
    private $openAi;

    public function __construct()
    {
        $this->openAi = new OpenAi(env('OPENAI_API_KEY'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'thread_id' => 'required|string',
            'message' => 'required|string',
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $user = User::find(Auth::id());
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $thread = $user->threads()->where('thread_id', $request->thread_id)->first();
        if (!$thread) {
            return response()->json([
                'message' => 'Thread not found',
            ], 404);
        }

        $is_new_thread = $thread->imageMessages()->where('role', 'assistant')->count() == 0 || $thread->imageMessages()->where('role', 'user')->count() == 0;

        // save user image message
        $content = [
            [
                'type' => 'text',
                'text' => [
                    'value' => $request->message,
                ],
            ],
        ];

        $userImageMessage = $user->imageMessages()->create([
            'thread_id' => $request->thread_id,
            'role' => 'user',
            'content' => json_encode($content),
        ]);

        // generate assistant image message using OpenAI API Curl
        // curl https://api.openai.com/v1/images/generations \
        // -H "Content-Type: application/json" \
        // -H "Authorization: Bearer $OPENAI_API_KEY" \
        // -d '{
        //     "model": "dall-e-3",
        //     "prompt": "a white siamese cat",
        //     "n": 1,
        //     "size": "1024x1024"
        // }'
        try {
            $result = $this->openAi->image([
                "prompt" => $request->message,
                "n" => 1,
                "size" => "1024x1024",
                "response_format" => "url",
                "model" => "dall-e-3",
                "user" => "user_" . $user->id
             ]);

            $result = json_decode($result, true);

            // save assistant image file to storage
            $images = [];
            foreach ($result['data'] as $image) {
                $imageName = 'user_' . $user->id . '_' . $thread->id . '_' . time();
                $imagePath = 'images/' . $imageName . '.png';
                $imageUrl = config('app.url') . '/storage/' . $imagePath;
                $imageStore = Storage::disk('public')->put($imagePath, file_get_contents($image['url']));
                if ($imageStore) $images[] = $imageUrl;
            }

            // save assistant image message
            $assistantImageMessage = $user->imageMessages()->create([
                'thread_id' => $request->thread_id,
                'role' => 'assistant',
                'caption' => 'Model --DALL-E-3 Size --1024x1024 Quality --HD',
                'images' => json_encode($images),
                'content' => json_encode($result['data']),
            ]);


            return response()->json([
                'message' => 'Image message created successfully',
                'result' => $result['data'],
                'user_message' => $userImageMessage,
                'assistant_message' => $assistantImageMessage,
                'is_new_thread' => $is_new_thread
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to generate image message',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
