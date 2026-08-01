<?php

namespace App\Http\Controllers;

use App\Models\Sujet;
use Illuminate\Http\Request;

class SujetController extends Controller
{
    // GET /api/sujets — liste tous les sujets (utilisé par StagiaireSujets.jsx)
    public function index()
    {
        // with('encadrant') évite le problème du "N+1" : au lieu de faire
        // une requête SQL par sujet pour récupérer son encadrant, Laravel
        // fait une seule requête groupée pour tous les encadrants.
        $sujets = Sujet::with('encadrant')->get();

        return response()->json($sujets);
    }

    // POST /api/admin/sujets — création (AdminAjouterSujet.jsx)
    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'         => 'required|string|max:255',
            'description'   => 'required|string',
            'encadrant_id'  => 'required|exists:users,id',
        ]);

        $sujet = Sujet::create($data);

        return response()->json([
            'message' => 'Sujet créé avec succès',
            'sujet'   => $sujet,
        ], 201);
    }

    // PUT /api/admin/sujets/{id} — modification (AdminModifierSujet.jsx)
    public function update(Request $request, $id)
    {
        $sujet = Sujet::findOrFail($id);

        $data = $request->validate([
            'titre'         => 'sometimes|required|string|max:255',
            'description'   => 'sometimes|required|string',
            'encadrant_id'  => 'sometimes|required|exists:users,id',
        ]);

        $sujet->update($data);

        return response()->json([
            'message' => 'Sujet modifié avec succès',
            'sujet'   => $sujet,
        ]);
    }

    // DELETE /api/admin/sujets/{id} — suppression (AdminSupprimerSujet.jsx)
    public function destroy($id)
    {
        $sujet = Sujet::findOrFail($id);
        $sujet->delete();

        return response()->json([
            'message' => 'Sujet supprimé avec succès',
        ]);
    }
}