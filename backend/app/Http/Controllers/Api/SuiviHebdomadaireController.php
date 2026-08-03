<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SuiviHebdomadaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class SuiviHebdomadaireController extends Controller
{
    // POST /api/suivis-hebdo — le stagiaire soumet son suivi de la semaine
    public function store(Request $request)
    {
        $request->validate([
            'taches' => 'required|string',
            'difficultes' => 'nullable|string',
            'solutions' => 'nullable|string',
        ]);

        // On calcule automatiquement le libellé de la semaine en cours
        // (lundi au vendredi), plutôt que de laisser le stagiaire le taper.
        $debut = Carbon::now()->startOfWeek(Carbon::MONDAY)->translatedFormat('d F Y');
        $fin = Carbon::now()->startOfWeek(Carbon::MONDAY)->addDays(4)->translatedFormat('d F Y');
        $semaine = "Semaine du {$debut} au {$fin}";

        $suivi = SuiviHebdomadaire::create([
            'stagiaire_id' => Auth::id(),
            'semaine' => $semaine,
            'taches' => $request->taches,
            'difficultes' => $request->difficultes,
            'solutions' => $request->solutions,
            'statut' => 'en_attente',
        ]);

        return response()->json($suivi, 201);
    }

    // GET /api/mes-suivis-hebdo — historique du stagiaire connecté
    public function mesSuivis()
    {
        $suivis = SuiviHebdomadaire::where('stagiaire_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($suivis);
    }

    // GET /api/encadrant/suivis-hebdo — suivis des stagiaires supervisés par l'encadrant connecté
    public function index()
    {
        $encadrantId = Auth::id();

        $suivis = SuiviHebdomadaire::whereHas('stagiaire.candidatures', function ($query) use ($encadrantId) {
            $query->where('statut', 'acceptee')
                  ->whereHas('sujet', function ($q) use ($encadrantId) {
                      $q->where('encadrant_id', $encadrantId);
                  });
        })
        ->with('stagiaire:id,nom,prenom')
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($suivis);
    }

    // PATCH /api/encadrant/suivis-hebdo/{id} — valider / commenter
    public function update(Request $request, $id)
    {
        $suivi = SuiviHebdomadaire::findOrFail($id);

        $request->validate([
            'statut' => 'sometimes|in:en_attente,valide',
            'commentaire' => 'sometimes|string|nullable',
        ]);

        $suivi->update($request->only(['statut', 'commentaire']));

        return response()->json($suivi);
    }
}