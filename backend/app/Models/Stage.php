<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $fillable = [
        'candidature_id',
        'sujet_id',
        'date_debut',
        'date_fin',
        'statut',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function sujet()
    {
        return $this->belongsTo(Sujet::class, 'sujet_id');
    }

    public function candidature()
    {
        return $this->belongsTo(Candidature::class, 'candidature_id');
    }

    // Accès pratique : $stage->stagiaire au lieu de $stage->candidature->stagiaire
    public function getStagiaireAttribute()
    {
        return $this->candidature?->stagiaire;
    }

    // Calculé à la volée (n'écrase pas la colonne "statut" existante)
    public function getStatutCalculeAttribute()
    {
        if (!$this->date_fin) {
            return 'actif';
        }
        return $this->date_fin->isPast() ? 'termine' : 'actif';
    }
}