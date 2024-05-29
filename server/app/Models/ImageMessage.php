<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageMessage extends Model
{
    use HasFactory;

    protected $guarded = [];

    // protected $appends = ['images', 'content'];

    public function thread()
    {
        return $this->belongsTo(Thread::class, 'thread_id', 'thread_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getImagesAttribute($value)
    {
        return json_decode($value);
    }

    public function getContentAttribute($value)
    {
        return json_decode($value);
    }
}
