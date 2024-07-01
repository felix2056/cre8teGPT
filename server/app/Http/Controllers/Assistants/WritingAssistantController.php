<?php

namespace App\Http\Controllers\Assistants;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Document;
use App\Models\User;
use Carbon\Carbon;

class WritingAssistantController extends Controller
{
    public function documents()
    {
        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found.',
        ], 404);

        $documents = [];

        // if documents are empty, create a new document
        if ($user->documents->isEmpty()) {
            $user->documents()->create([
                'title' => 'Untitled Document',
                'slug' => 'untitled-document',
            ]);
        }

        $documents['today'] = $user->documents()->whereDate('created_at', Carbon::today())->get();
        $documents['yesterday'] = $user->documents()->whereDate('created_at', Carbon::yesterday())->get();
        $documents['previous'] = $user->documents()->whereDate('created_at', '>', Carbon::now()->subDays(7))->whereDate('created_at', '<', Carbon::yesterday())->get();
        $documents['older'] = $user->documents()->whereDate('created_at', '<', Carbon::now()->subDays(7))->get();

        return response()->json([
            'documents' => $documents,
        ]);
    }

    public function showDocument($document_id)
    {
        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found.',
        ], 404);

        $document = $user->documents()->where('id', $document_id)->orWhere('slug', $document_id)->first();
        if (!$document) return response()->json([
            'message' => 'Document not found.',
        ], 404);

        return response()->json([
            'document' => $document,
        ]);
    }

    public function storeDocument(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
        ]);

        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found.',
        ], 404);



        $document = $user->documents()->create([
            'title' => ucwords($request->title),
            // 'content' => $request->content,
            // 'status' => $request->status,
            // 'visibility' => $request->visibility,
            // 'password' => $request->password,
            // 'password_hint' => $request->password_hint,
        ]);

        return response()->json([
            'document' => $document,
        ]);
    }

    public function updateDocument(Request $request, $document_id)
    {
        $request->validate([
            'title' => 'required|string',
            // 'content' => 'required|string',
            // 'status' => 'required|string',
            // 'visibility' => 'required|string',
            // 'password' => 'nullable|string',
            // 'password_hint' => 'nullable|string',
        ]);

        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found.',
        ], 404);

        $document = $user->documents()->where('id', $document_id)->orWhere('slug', $document_id)->first();
        if (!$document) return response()->json([
            'message' => 'Document not found.',
        ], 404);

        $document->update([
            'title' => ucwords($request->title),
            // 'content' => $request->content,
            // 'status' => $request->status,
            // 'visibility' => $request->visibility,
            // 'password' => $request->password,
            // 'password_hint' => $request->password_hint,
        ]);

        return response()->json([
            'document' => $document,
        ]);
    }

    public function updateDocumentTitle(Request $request, $document_id)
    {
        $request->validate([
            'title' => 'required|string',
        ]);

        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found.',
        ], 404);

        $document = $user->documents()->where('id', $document_id)->orWhere('slug', $document_id)->first();
        if (!$document) return response()->json([
            'message' => 'Document not found.',
        ], 404);

        $document->update([
            'title' => ucwords($request->title),
        ]);

        return response()->json([
            'document' => $document,
        ]);
    }

    public function updateDocumentContent(Request $request, $document_id)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found.',
        ], 404);

        $document = $user->documents()->where('id', $document_id)->orWhere('slug', $document_id)->first();
        if (!$document) return response()->json([
            'message' => 'Document not found.',
        ], 404);

        $document->update([
            'content' => $request->content,
        ]);

        return response()->json([
            'document' => $document,
        ]);
    }

    public function updateDocumentVisibility(Request $request, $document_id)
    {
        $request->validate([
            'visibility' => 'required|string',
        ]);

        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found.',
        ], 404);

        $document = $user->documents()->where('id', $document_id)->orWhere('slug', $document_id)->first();
        if (!$document) return response()->json([
            'message' => 'Document not found.',
        ], 404);

        $document->update([
            'visibility' => $request->visibility,
        ]);

        return response()->json([
            'document' => $document,
        ]);
    }

    public function updateDocumentPassword(Request $request, $document_id)
    {
        $request->validate([
            'password' => 'required|string',
            'password_hint' => 'required|string',
        ]);

        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found.',
        ], 404);

        $document = $user->documents()->where('id', $document_id)->orWhere('slug', $document_id)->first();
        if (!$document) return response()->json([
            'message' => 'Document not found.',
        ], 404);

        $document->update([
            'password' => $request->password,
            'password_hint' => $request->password_hint,
        ]);

        return response()->json([
            'document' => $document,
        ]);
    }

    public function pinDocument($document_id)
    {
        $user = User::find(Auth::id());
        if (!$user) return response()->json([
            'message' => 'User not found.',
        ], 404);

        $document = $user->documents()->where('id', $document_id)->orWhere('slug', $document_id)->first();
        if (!$document) return response()->json([
            'message' => 'Document not found.',
        ], 404);

        $document->update([
            'is_pinned' => !$document->is_pinned,
        ]);

        return response()->json([
            'document' => $document,
        ]);
    }
}
