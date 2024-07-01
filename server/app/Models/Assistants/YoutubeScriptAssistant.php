<?php

namespace App\Models\Assistants;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;

class YoutubeScriptAssistant extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFramingAttribute($value)
    {
        return json_decode($value);
    }

    public function getTitlesAttribute($value)
    {
        return json_decode($value);
    }
}
