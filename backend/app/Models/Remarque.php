<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Remarque extends Model
{
    protected $fillable = ['stagiaire_id', 'encadrant_id', 'texte'];

public function stagiaire()
{
    return $this->belongsTo(User::class, 'stagiaire_id');
}

public function encadrant()
{
    return $this->belongsTo(User::class, 'encadrant_id');
}
}
