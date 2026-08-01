<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidature;
use App\Models\Sujet;
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

    // GET /api/encadrant/candidatures — liste des candidatures reçues sur les sujets de l'encadrant connecté
    public function index(Request $request)
    {
        $candidatures = Candidature::with(['stagiaire', 'sujet'])
            ->whereHas('sujet', function ($query) use ($request) {
                $query->where('encadrant_id', $request->user()->id);
            })
            ->get();

        return response()->json($candidatures);
    }

    // POST /api/encadrant/candidatures/{id}/accepter
    public function accepter(Request $request, $id)
    {
        $candidature = Candidature::with('sujet')->findOrFail($id);

        // Vérifie que ce sujet appartient bien à l'encadrant connecté
        if ($candidature->sujet->encadrant_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        if ($candidature->statut !== 'en_attente') {
            return response()->json(['message' => 'Cette candidature a déjà été traitée.'], 422);
        }

        // DB::transaction : soit TOUTES ces opérations réussissent ensemble,
        // soit AUCUNE n'est appliquée (si une échoue en cours de route,
        // tout est annulé). Indispensable ici car on touche 3 tables liées :
        // si le verrouillage du sujet échouait après avoir accepté la
        // candidature, on se retrouverait avec un sujet "disponible" alors
        // qu'il a déjà un stagiaire accepté — incohérence à éviter.
        DB::transaction(function () use ($candidature) {
            $candidature->update(['statut' => 'acceptee']);

            $candidature->sujet->update(['statut' => 'verrouille']);

            // Refuse automatiquement toutes les autres candidatures en attente sur ce sujet
            Candidature::where('sujet_id', $candidature->sujet_id)
                ->where('id', '!=', $candidature->id)
                ->where('statut', 'en_attente')
                ->update(['statut' => 'refusee']);
        });

        return response()->json(['message' => 'Candidature acceptée, sujet verrouillé.']);
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