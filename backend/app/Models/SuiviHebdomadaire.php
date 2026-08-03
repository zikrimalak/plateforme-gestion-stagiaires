<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuiviHebdomadaire extends Model
{
    protected $table = 'suivis_hebdomadaires';

    protected $fillable = ['stagiaire_id', 'semaine', 'taches', 'difficultes', 'solutions', 'statut', 'commentaire'];

    public function stagiaire()
    {
        return $this->belongsTo(User::class, 'stagiaire_id');
    }
}