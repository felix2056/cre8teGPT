<?php

namespace App\Http\Controllers;

use App\Models\Assistant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\ImageMessage;
use App\Models\PhotoMessage;
use App\Models\User;

class ThreadController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found'
        ], 404);

        // "threads": [
        //     {
        //       "today": [
        //         {
        //           "title": "Cre8teGPT Defination",
        //           "isActive": true,
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Your last Question",
        //           "isActive": false,
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Business Shortcurt Methode",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Best way to maintain code Quality",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         }
        //       ],
        //       "yesterday": [
        //         {
        //           "title": "How to write a code",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Form Html CSS JS",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "HTML Shortcurt Methode",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Best way to maintain code Quality",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Cre8teGPT Defination",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Your last Question",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Unique Shortcurt Methode",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Generate a circle Image",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         }
        //       ],
        //       "previous": [
        //         {
        //           "title": "User Assistant Request",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Funtion Js",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Generate a Image",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Best way to maintain code Quality",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Cre8teGPT Defination",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Your last Question",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Unique Shortcurt Methode",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Best way to maintain Remote Team",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         }
        //       ],
        //       "older": [
        //         {
        //           "title": "AI writing: Free Trial",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Your last Question",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Education Shortcurt Methode",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "1992 Environment Policy",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Senior UX/UI Design",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Your last Question",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Dark Mode Html CSS JS",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         },
        //         {
        //           "title": "Best way to maintain Remote Team",
        //           "list": [
        //             {
        //               "icon": "refresh-cw",
        //               "text": "Regenerate"
        //             },
        //             {
        //               "icon": "tag",
        //               "text": "Pin Chat"
        //             },
        //             {
        //               "icon": "file-text",
        //               "text": "Rename"
        //             },
        //             {
        //               "icon": "share-2",
        //               "text": "Share"
        //             },
        //             {
        //               "icon": "trash-2",
        //               "text": "Delete Chat"
        //             }
        //           ]
        //         }
        //       ]
        //     }
        // ];

        $threads = [];
        $threads['today'] = $user->threads()->whereDate('created_at', Carbon::today())->get();
        $threads['yesterday'] = $user->threads()->whereDate('created_at', Carbon::yesterday())->get();
        $threads['previous'] = $user->threads()->whereDate('created_at', '>', Carbon::now()->subDays(7))->whereDate('created_at', '<', Carbon::yesterday())->get();
        $threads['older'] = $user->threads()->whereDate('created_at', '<', Carbon::now()->subDays(7))->get();

        return response()->json([
            'threads' => $threads
        ], 200);
    }

    public function assistant($slug)
    {
        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found'
        ], 404);

        $assistant = Assistant::where('slug', $slug)->first();
        if (!$assistant) return response()->json([
            'message' => 'Assistant not found'
        ], 404);

        $threads = [];
        $threads['today'] = $user->threads()->whereDate('created_at', Carbon::today())->where('assistant_id', $assistant->identifier)->get();
        $threads['yesterday'] = $user->threads()->whereDate('created_at', Carbon::yesterday())->where('assistant_id', $assistant->identifier)->get();
        $threads['previous'] = $user->threads()->whereDate('created_at', '>', Carbon::now()->subDays(7))->whereDate('created_at', '<', Carbon::yesterday())->where('assistant_id', $assistant->identifier)->get();
        $threads['older'] = $user->threads()->whereDate('created_at', '<', Carbon::now()->subDays(7))->where('assistant_id', $assistant->identifier)->get();

        return response()->json([
            'threads' => $threads
        ], 200);
    }

    public function show($thread_id)
    {
        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found'
        ], 404);

        $thread = $user->threads()->where('thread_id', $thread_id)->first();
        if (!$thread) return response()->json([
            'message' => 'Thread not found'
        ], 404);

        $messages = [];
        
        if (request()->query('type') === 'image-messages') {
            $messages = $user->imageMessages()->where('thread_id', $thread_id)->get();
        }

        if (request()->query('type') === 'photo-messages') {
            $messages = $user->photoMessages()->where('thread_id', $thread_id)->get();
        }

        return response()->json([
            'thread' => $thread,
            'messages' => $messages
        ], 200);
    }

    public function store(Request $request)
    {
        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found'
        ], 404);

        $thread = $user->threads()->create([
            'assistant_id' => $request->assistant_id,
            'thread_id' => $request->thread_id,
            'title' => $request->title,
        ]);

        return response()->json([
            'thread' => $thread,
            'message' => 'Thread created successfully'
        ], 201);
    }
}
