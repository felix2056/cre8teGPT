<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tool extends Model
{
    use HasFactory;

    protected $guarded = [];

    public $appends = ['url'];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'tool_categories')->withTimestamps();
    }

    public function getUrlAttribute($value)
    {
        $category_slug = $this->categories->first()->slug;
        return "/tools/{$category_slug}/{$this->slug}";
    }
}