<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $fillable = ['sujet_id', 'candidature_id', 'date_debut', 'date_fin', 'statut'];

public function sujet()
{
    return $this->belongsTo(Sujet::class);
}

public function candidature()
{
    return $this->belongsTo(Candidature::class);
}

public function suivisHebdomadaires()
{
    return $this->hasMany(SuiviHebdomadaire::class);
}

// Raccourci pratique : retrouver le stagiaire depuis un Stage
public function stagiaire()
{
    return $this->candidature->stagiaire;
}
}
