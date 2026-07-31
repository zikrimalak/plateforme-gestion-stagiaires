<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = ['stagiaire_id', 'type', 'nom_fichier', 'chemin_fichier', 'statut', 'commentaire'];

public function stagiaire()
{
    return $this->belongsTo(User::class, 'stagiaire_id');
}
}
