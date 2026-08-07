<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Smalot\PdfParser\Parser as PdfParser;

class DocumentController extends Controller
{
    private const TYPES_ANALYSES = ['CV', 'Lettre de motivation'];

    // POST /documents — le stagiaire dépose un document
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'fichier' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5 Mo max
        ]);

        $fichier = $request->file('fichier');

        $chemin = $fichier->store('documents/' . Auth::id());

        $texteExtrait = null;

        if (in_array($request->type, self::TYPES_ANALYSES) && $fichier->getClientOriginalExtension() === 'pdf') {
            $texteExtrait = $this->extraireTextePdf(Storage::path($chemin));
        }

        $document = Document::create([
            'stagiaire_id' => Auth::id(),
            'type' => $request->type,
            'nom_fichier' => $fichier->getClientOriginalName(),
            'chemin_fichier' => $chemin,
            'texte_extrait' => $texteExtrait,
            'statut' => 'en_attente',
        ]);

        return response()->json($document, 201);
    }

    private function extraireTextePdf(string $cheminAbsolu): ?string
    {
        try {
            $parser = new PdfParser();
            $pdf = $parser->parseFile($cheminAbsolu);
            $texte = trim($pdf->getText());

            if ($texte === '') {
                return null;
            }

            // Certains PDF produisent du texte avec des octets invalides en UTF-8
            // (accents mal encodés dans le fichier source, caractères de contrôle...).
            // Sans ce nettoyage, json_encode() plante plus tard quand Laravel renvoie
            // le document en JSON — d'où l'erreur "Malformed UTF-8 characters".
            $texte = $this->nettoyerUtf8($texte);

            return $texte !== '' ? $texte : null;
        } catch (\Throwable $e) {
            Log::warning('Extraction PDF échouée pour ' . $cheminAbsolu . ' : ' . $e->getMessage());
            return null;
        }
    }

    // Supprime/remplace les séquences d'octets qui ne forment pas de l'UTF-8 valide
    private function nettoyerUtf8(string $texte): string
    {
        $nettoye = iconv('UTF-8', 'UTF-8//IGNORE', $texte);
        return $nettoye !== false ? $nettoye : '';
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

        if (Auth::id() !== $document->stagiaire_id && Auth::user()->role === 'stagiaire') {
            abort(403);
        }

        return Storage::download($document->chemin_fichier, $document->nom_fichier);
    }
}