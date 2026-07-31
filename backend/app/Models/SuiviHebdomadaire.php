<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuiviHebdomadaire extends Model
{
    protected $fillable = ['stage_id', 'semaine', 'taches', 'difficultes', 'solutions', 'statut', 'commentaire'];

public function stage()
{
    return $this->belongsTo(Stage::class);
}
}
