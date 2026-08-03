<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    // POST /documents — le stagiaire dépose un document
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'fichier' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5 Mo max
        ]);

        // stocke le fichier dans storage/app/documents/{id_stagiaire}/
        $chemin = $request->file('fichier')->store('documents/' . Auth::id());

        $document = Document::create([
            'stagiaire_id' => Auth::id(),
            'type' => $request->type,
            'nom_fichier' => $request->file('fichier')->getClientOriginalName(),
            'chemin_fichier' => $chemin,
            'statut' => 'en_attente',
        ]);

        return response()->json($document, 201);
    }

    // GET /mes-documents — historique du stagiaire connecté
    public function mesDocuments()
    {
        $documents = Document::where('stagiaire_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($documents);
    }

    // GET /encadrant/documents — documents des stagiaires supervisés par l'encadrant connecté
    public function index()
    {
        $encadrantId = Auth::id();

        $documents = Document::whereHas('stagiaire.candidatures', function ($query) use ($encadrantId) {
            $query->where('statut', 'acceptee')
                  ->whereHas('sujet', function ($q) use ($encadrantId) {
                      $q->where('encadrant_id', $encadrantId);
                  });
        })
        ->with('stagiaire:id,nom,prenom')
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($documents);
    }

    // PATCH /encadrant/documents/{id} — valider / refuser / commenter
    public function update(Request $request, $id)
    {
        $document = Document::findOrFail($id);

        $request->validate([
            'statut' => 'sometimes|in:en_attente,valide,refuse',
            'commentaire' => 'sometimes|string|nullable',
        ]);

        $document->update($request->only(['statut', 'commentaire']));

        return response()->json($document);
    }

    // GET /documents/{id}/download
    public function telecharger($id)
    {
        $document = Document::findOrFail($id);

        // sécurité : seul le stagiaire propriétaire ou un encadrant/admin peut télécharger
        if (Auth::id() !== $document->stagiaire_id && Auth::user()->role === 'stagiaire') {
            abort(403);
        }

        return Storage::download($document->chemin_fichier, $document->nom_fichier);
    }
}