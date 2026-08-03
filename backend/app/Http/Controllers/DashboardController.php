<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use App\Models\Remarque;
use App\Models\Stage;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function admin()
    {
        $stages = Stage::with('sujet.encadrant')->get();

        $stagesActifs = $stages->filter(fn($s) => $s->statut === 'actif')->count();
        $stagesTermines = $stages->filter(fn($s) => $s->statut === 'termine')->count();

        $stagiairesParEncadrant = $stages
            ->groupBy(fn($s) => $s->sujet->encadrant->nom . ' ' . $s->sujet->encadrant->prenom)
            ->map(fn($groupe, $nomEncadrant) => [
                'encadrant' => $nomEncadrant,
                'nombre' => $groupe->count(),
            ])
            ->values();

        return response()->json([
            'stagesActifs' => $stagesActifs,
            'stagesTermines' => $stagesTermines,
            'stagiairesParEncadrant' => $stagiairesParEncadrant,
        ]);
    }

    public function encadrant(Request $request)
    {
        $encadrantId = $request->user()->id;

        $nbStagiaires = Candidature::where('statut', 'acceptee')
            ->whereHas('sujet', fn($q) => $q->where('encadrant_id', $encadrantId))
            ->count();

        $candidaturesEnAttente = Candidature::where('statut', 'en_attente')
            ->whereHas('sujet', fn($q) => $q->where('encadrant_id', $encadrantId))
            ->count();

        return response()->json([
            'nbStagiaires' => $nbStagiaires,
            'candidaturesEnAttente' => $candidaturesEnAttente,
        ]);
    }

    public function stagiaire(Request $request)
    {
        $stagiaireId = $request->user()->id;

        $candidature = Candidature::where('stagiaire_id', $stagiaireId)
            ->where('statut', 'acceptee')
            ->with('sujet.encadrant')
            ->first();

        $sujetAffecte = $candidature ? [
            'titre' => $candidature->sujet->titre,
            'encadrant' => [
                'nom' => $candidature->sujet->encadrant->nom . ' ' . $candidature->sujet->encadrant->prenom,
                'email' => $candidature->sujet->encadrant->email,
                'telephone' => $candidature->sujet->encadrant->telephone,
            ],
        ] : null;

        $remarques = Remarque::where('stagiaire_id', $stagiaireId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'sujetAffecte' => $sujetAffecte,
            'remarques' => $remarques,
        ]);
    }
}