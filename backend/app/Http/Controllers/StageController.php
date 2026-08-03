<?php

namespace App\Http\Controllers;

use App\Models\Stage;
use App\Models\Candidature;
use Illuminate\Http\Request;

class StageController extends Controller
{
    public function mettreAJourDates(Request $request)
    {
        $request->validate([
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
        ]);

        $candidature = Candidature::where('stagiaire_id', $request->user()->id)
    ->where('statut', 'acceptee')
    ->firstOrFail();

$stage = $candidature->stage;

        $stage->update([
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
        ]);

        return response()->json([
            'message' => 'Dates de stage enregistrées',
            'stage' => $stage,
        ]);
    }
}