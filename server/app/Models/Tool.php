<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tool extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $appends = ['badge'];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'tool_categories')->withTimestamps();
    }

    public function getBadgeAttribute()
    {
        $badges = ['new', 'hot', 'coming', 'free', 'popular', 'featured'];

        return $badges[array_rand($badges)];
    }
}
