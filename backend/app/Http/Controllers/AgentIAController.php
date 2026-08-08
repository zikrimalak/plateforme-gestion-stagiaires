<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Sujet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AgentIAController extends Controller
{
    private const OLLAMA_URL = 'http://localhost:11434/api/generate';
    private const OLLAMA_MODEL = 'llama3.2:1b';

    // Longueur max du CV/lettre injectée dans le prompt : un modèle aussi léger que le 1b
    // ralentit énormément (et devient moins fiable) avec un texte trop long. Les premiers
    // paragraphes (profil, formation, compétences) suffisent largement pour évaluer la pertinence.
    private const LONGUEUR_MAX_TEXTE = 600;

    public function sujetsRecommandes(Request $request)
    {
        set_time_limit(0);

    $stagiaireId = $request->user()->id;

        $cv = Document::where('stagiaire_id', $stagiaireId)->where('type', 'CV')->latest()->first();
        $lettre = Document::where('stagiaire_id', $stagiaireId)->where('type', 'Lettre de motivation')->latest()->first();

        $sujets = Sujet::where('statut', 'disponible')->get(['id', 'titre', 'description']);

        if (!$cv?->texte_extrait || !$lettre?->texte_extrait) {
            return response()->json([
                'sujets' => $sujets->map(fn($s) => [
                    'sujet_id' => $s->id,
                    'score' => null,
                    'justification' => null,
                ]),
                'avertissement' => 'Analyse indisponible : CV ou lettre de motivation non exploitable.',
            ]);
        }

        $texteCv = $this->tronquer($cv->texte_extrait);
        $texteLettre = $this->tronquer($lettre->texte_extrait);

        $resultat = [];
        $echecs = 0;

        // On score chaque sujet séparément plutôt qu'en un seul gros prompt : un petit modèle
        // comme llama3.2:1b répond bien plus vite ET plus fiablement sur une tâche simple
        // ("score CE sujet") que sur une tâche complexe ("score TOUS ces sujets d'un coup"),
        // où il a tendance à n'en traiter qu'un et ignorer les autres.
        foreach ($sujets as $sujet) {
            try {
                $score = $this->scorerUnSujet($texteCv, $texteLettre, $sujet);
                $resultat[] = [
                    'sujet_id' => $sujet->id,
                    'score' => $score['score'] ?? null,
                    'justification' => $score['justification'] ?? null,
                ];
            } catch (\Throwable $e) {
                Log::warning('Scoring échoué pour le sujet ' . $sujet->id . ' : ' . $e->getMessage());
                $echecs++;
                $resultat[] = [
                    'sujet_id' => $sujet->id,
                    'score' => null,
                    'justification' => null,
                ];
            }
        }

        $reponseJson = ['sujets' => $resultat];

        if ($echecs > 0) {
            $reponseJson['avertissement'] = $echecs === $sujets->count()
                ? "L'analyse IA est momentanément indisponible."
                : 'Analyse partielle : certains sujets n\'ont pas pu être évalués.';
        }

        return response()->json($reponseJson);
    }

    private function scorerUnSujet(string $texteCv, string $texteLettre, Sujet $sujet): array
    {
        $prompt = <<<PROMPT
Tu évalues la pertinence d'un sujet de stage pour un candidat, à partir de son CV et de sa lettre de motivation.

CV (extrait) : {$texteCv}

Lettre de motivation (extrait) : {$texteLettre}

Sujet de stage à évaluer : "{$sujet->titre}" — {$sujet->description}

Donne un score de pertinence de 0 à 100, et une justification très courte (une phrase, en français).

Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après, au format exact :
{"score": 85, "justification": "Le profil correspond bien car..."}
PROMPT;

        $reponse = Http::timeout(60)->post(self::OLLAMA_URL, [
            'model' => self::OLLAMA_MODEL,
            'prompt' => $prompt,
            'format' => 'json',
            'stream' => false,
        ]);

        if (!$reponse->successful()) {
            throw new \Exception('Ollama a répondu avec le code ' . $reponse->status());
        }

        $texteBrut = $reponse->json('response');
        $donnees = json_decode($texteBrut, true);

        if (!is_array($donnees) || !isset($donnees['score'])) {
            throw new \Exception('Réponse non exploitable : ' . $texteBrut);
        }

        return $donnees;
    }

    private function tronquer(string $texte): string
    {
        return mb_strlen($texte) > self::LONGUEUR_MAX_TEXTE
            ? mb_substr($texte, 0, self::LONGUEUR_MAX_TEXTE) . '...'
            : $texte;
    }
}