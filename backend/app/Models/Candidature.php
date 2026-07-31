<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidature extends Model
{
    protected $fillable = ['stagiaire_id', 'sujet_id', 'statut'];

public function stagiaire()
{
    return $this->belongsTo(User::class, 'stagiaire_id');
}

public function sujet()
{
    return $this->belongsTo(Sujet::class);
}

public function stage()
{
    return $this->hasOne(Stage::class);
}
}
