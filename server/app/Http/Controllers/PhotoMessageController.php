<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PhotoMessage;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Orhanerday\OpenAi\OpenAi;

class PhotoMessageController extends Controller
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
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'mask' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
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

        $is_new_thread = $thread->photoMessages()->where('role', 'assistant')->count() == 0 || $thread->photoMessages()->where('role', 'user')->count() == 0;

        // upload user photo to storage
        $image = $request->file('file');
        $imageName = 'user_' . $user->id . '_' . $thread->id . '_' . time();
        $imagePath = 'images/' . $imageName . '.png';
        $imageUrl = config('app.url') . '/storage/' . $imagePath;
        $imageStore = Storage::disk('public')->put($imagePath, file_get_contents($image));
        if (!$imageStore) {
            return response()->json([
                'message' => 'Failed to upload image',
            ], 500);
        }
        
        // save user photo message
        $content = [
            [
                'text' => [
                    'value' => $request->message,
                ],
                'image' => [
                    'url' => $imageUrl,
                ],
            ],
        ];

        $userPhotoMessage = $user->photoMessages()->create([
            'thread_id' => $request->thread_id,
            'role' => 'user',
            'content' => json_encode($content),
        ]);

        // creates an edited or extended image given an original image and a prompt.
        // curl https://api.openai.com/v1/images/edits \
        // -H "Authorization: Bearer $OPENAI_API_KEY" \
        // -F image="@otter.png" \
        // -F mask="@mask.png" \
        // -F prompt="A cute baby sea otter wearing a beret" \
        // -F n=2 \
        // -F size="1024x1024"

        try {
            $mask = null;
            if ($request->hasFile('mask')) $mask = curl_file_create($request->file('mask'));

            $result = $this->openAi->imageEdit([
                "image" => curl_file_create('https://www.freepnglogos.com/uploads/food-png/food-grass-fed-beef-foodservice-products-grass-run-farms-4.png'), // $imageUrl,
                "mask" => $mask,
                "prompt" => $request->message,
                "n" => 2,
                "size" => "1024x1024",
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

            // save assistant photo message
            $assistantPhotoMessage = $user->photoMessages()->create([
                'thread_id' => $request->thread_id,
                'role' => 'assistant',
                'caption' => 'Model --DALL-E-3 Size --1024x1024 Quality --HD',
                'images' => json_encode($images),
                'content' => json_encode($result['data']),
            ]);


            return response()->json([
                'message' => 'Photo message created successfully',
                'result' => $result['data'],
                'user_message' => $userPhotoMessage,
                'assistant_message' => $assistantPhotoMessage,
                'is_new_thread' => $is_new_thread
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to generate photo message',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
