<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Document extends Model
{
    use HasFactory, SoftDeletes, HasSlug;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'slug',
        'status',
        'visibility',
        'password',
        'password_hint',
    ];

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}
