<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolCategory extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function tools()
    {
        return $this->belongsToMany(Tool::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }
}
