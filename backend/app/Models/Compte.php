<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compte extends Model
{
    protected $fillable = [
        'user_id',
        'statut',
        'date_creation',
        'date_activation',
        'token',
        'token_expire_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}