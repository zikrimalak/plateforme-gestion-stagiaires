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
        'statut' ,
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function candidature()
{
    return $this->belongsTo(Candidature::class);
}

    public function sujet()
    {
        return $this->belongsTo(Sujet::class, 'sujet_id');
    }

    // Un stage est "actif" tant que date_fin n'est pas dépassée (ou pas encore saisie)
    public function getStatutAttribute()
    {
        if (!$this->date_fin) {
            return 'actif';
        }
        return $this->date_fin->isPast() ? 'termine' : 'actif';
    }
}