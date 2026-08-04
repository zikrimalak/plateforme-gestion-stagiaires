<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidature;
use App\Models\Sujet;
use App\Models\Stage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class CandidatureController extends Controller
{
    // POST /api/candidatures — un stagiaire postule à un sujet
    public function store(Request $request)
    {
        $data = $request->validate([
            'sujet_id' => 'required|exists:sujets,id',
        ]);

        $sujet = Sujet::findOrFail($data['sujet_id']);

        if ($sujet->statut === 'verrouille') {
            return response()->json(['message' => 'Ce sujet n\'est plus disponible.'], 422);
        }

        // Empêche de postuler deux fois au même sujet
        $dejaCandidat = Candidature::where('stagiaire_id', $request->user()->id)
            ->where('sujet_id', $data['sujet_id'])
            ->exists();

        if ($dejaCandidat) {
            return response()->json(['message' => 'Vous avez déjà postulé à ce sujet.'], 422);
        }

        $candidature = Candidature::create([
            'stagiaire_id' => $request->user()->id,
            'sujet_id' => $data['sujet_id'],
            'statut' => 'en_attente',
        ]);

        return response()->json([
            'message' => 'Candidature envoyée avec succès',
            'candidature' => $candidature,
        ], 201);
    }
public function index(Request $request)
{
    $candidatures = Candidature::with(['stagiaire', 'sujet'])
        ->whereHas('sujet', function ($query) use ($request) {
            $query->where('encadrant_id', $request->user()->id);
        })
        ->get();

    return response()->json($candidatures);
}
    // GET /api/encadrant/candidatures — liste des candidatures reçues sur les sujets de l'encadrant connecté
    public function accepter($id)
{
    DB::transaction(function () use ($id) {
        $candidature = Candidature::with('sujet')->findOrFail($id);

        $candidature->update(['statut' => 'acceptee']);

        $candidature->sujet->update(['statut' => 'verrouille']);

        Candidature::where('sujet_id', $candidature->sujet_id)
            ->where('id', '!=', $candidature->id)
            ->where('statut', 'en_attente')
            ->update(['statut' => 'refusee']);

        Stage::create([
            'sujet_id' => $candidature->sujet_id,
            'candidature_id' => $candidature->id,
        ]);
    });

    return response()->json(['message' => 'Candidature acceptée']);
}

    
   

   

    // POST /api/encadrant/candidatures/{id}/refuser
    public function refuser(Request $request, $id)
    {
        $candidature = Candidature::with('sujet')->findOrFail($id);

        if ($candidature->sujet->encadrant_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $candidature->update(['statut' => 'refusee']);

        return response()->json(['message' => 'Candidature refusée.']);
    }
}