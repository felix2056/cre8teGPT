<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;
    

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'avatar',
        'email',
        'phone',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * The attributes that should be appended.
     */
    protected $appends = ['full_name', 'avatar'];

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAvatarAttribute($avatar)
    {
        // return image with first and last name initials if avatar is null
        if (is_null($avatar)) {
            $colors = [
                'EF4444', 'F59E0B', '10B981', '3B82F6', '6366F1',
                '8B5CF6', 'EC4899', 'F43F5E', 'F97316', '22C55E',
                '4F46E5', '818CF8', '34D399', '6EE7B7', '93C5FD',
                'A5B4FC', 'FBCFE8', 'F9A8D4', 'FECACA', 'FED7AA',
                'FDE68A', 'A7F3D0', '6EE7B7', '93C5FD', 'A5B4FC',
                '818CF8', 'FBCFE8', 'F9A8D4', 'FECACA', 'FED7AA',
                'FDE68A', 'A7F3D0', '6EE7B7', '93C5FD', 'A5B4FC',
                '818CF8', 'FBCFE8', 'F9A8D4', 'FECACA', 'FED7AA',
                'FDE68A', 'A7F3D0', '6EE7B7', '93C5FD', 'A5B4FC',
                '818CF8', 'FBCFE8', 'F9A8D4', 'FECACA', 'FED7AA',
                'FDE68A', 'A7F3D0', '6EE7B7', '93C5FD', 'A5B4FC',
                '818CF8', 'FBCFE8', 'F9A8D4', 'FECACA', 'FED7AA',
                'FDE68A', 'A7F3D0', '6EE7B7', '93C5FD', 'A5B4FC',
                '818CF8', 'FBCFE8', 'F9A8D4', 'FECACA', 'FED7AA',
                'FDE68A', 'A7F3D0', '6EE7B7', '93C5FD', 'A5B4FC',
            ];

            $backgrounds = [
                'F87171', 'FBBF24', 'FACC15', '90CDF4', '4F46E5',
                '818CF8', '34D399', '6EE7B7', '93C5FD', 'A5B4FC',
                'FBCFE8', 'F9A8D4', 'FECACA', 'FED7AA', 'FDE68A',
                'A7F3D0', '6EE7B7', '93C5FD', 'A5B4FC', '818CF8',
                'FBCFE8', 'F9A8D4', 'FECACA', 'FED7AA', 'FDE68A',
                'A7F3D0', '6EE7B7', '93C5FD', 'A5B4FC', '818CF8',
            ];

            return 'https://ui-avatars.com/api/?name=' . urlencode($this->full_name) . '&color=' . $colors[rand(0, 79)] . '&background=' . $backgrounds[rand(0, 29)] . '&size=128&rounded=true&bold=true&font-size=0.33&length=2';
        }

        return $avatar;
    }
}