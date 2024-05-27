<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoMessage extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function thread()
    {
        return $this->belongsTo(Thread::class, 'thread_id', 'thread_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getVideosAttribute($value)
    {
        return json_decode($value);
    }

    public function getContentAttribute($value)
    {
        return json_decode($value);
    }
}
