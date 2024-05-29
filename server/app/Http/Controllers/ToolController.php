<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

use App\Models\Tool;

class ToolController extends Controller
{
    public function index()
    {
        $categories = Category::with('tools')->get();

        return response()->json([
            'categories' => $categories
        ]);
    }

    public function show($slug)
    {
        $tool = Tool::where('slug', $slug)->first();

        return response()->json([
            'tool' => $tool
        ]);
    }
}
