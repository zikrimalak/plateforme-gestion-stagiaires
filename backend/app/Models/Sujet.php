<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sujet extends Model
{
    protected $fillable = ['titre', 'description', 'encadrant_id', 'statut'];

public function encadrant()
{
    return $this->belongsTo(User::class, 'encadrant_id');
}

public function candidatures()
{
    return $this->hasMany(Candidature::class);
}

public function stage()
{
    return $this->hasOne(Stage::class);
}
}
