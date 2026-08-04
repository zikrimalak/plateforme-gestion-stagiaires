<?php

namespace App\Http\Controllers;

use App\Models\Stage;
use Illuminate\Http\Request;

class StageController extends Controller
{
    public function mettreAJourDates(Request $request)
    {
        $request->validate([
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
        ]);

        $stage = Stage::whereHas('candidature', function ($q) use ($request) {
            $q->where('stagiaire_id', $request->user()->id)
              ->where('statut', 'acceptee');
        })->first();

        if (!$stage) {
            return response()->json([
                'message' => 'Aucun stage trouvé pour votre compte.',
            ], 404);
        }

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