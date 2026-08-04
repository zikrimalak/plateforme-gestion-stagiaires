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

        $stagesActifs = $stages->filter(fn($s) => $s->statutCalcule === 'actif')->count();
        $stagesTermines = $stages->filter(fn($s) => $s->statutCalcule === 'termine')->count();

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

        $stage = Stage::whereHas('candidature', fn($q) => $q->where('stagiaire_id', $stagiaireId))
            ->with('sujet.encadrant')
            ->first();

        $sujetAffecte = $stage ? [
            'titre' => $stage->sujet->titre,
            'dateDebut' => $stage->date_debut,
            'dateFin' => $stage->date_fin,
            'encadrant' => [
                'nom' => $stage->sujet->encadrant->nom . ' ' . $stage->sujet->encadrant->prenom,
                'email' => $stage->sujet->encadrant->email,
                'telephone' => $stage->sujet->encadrant->telephone,
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