<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Thread extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function imageMessages()
    {
        return $this->hasMany(ImageMessage::class, 'thread_id', 'thread_id');
    }

    public function photoMessages()
    {
        return $this->hasMany(PhotoMessage::class, 'thread_id', 'thread_id');
    }
}
