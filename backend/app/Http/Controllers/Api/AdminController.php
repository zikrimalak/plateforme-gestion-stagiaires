<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\VerificationCompteMail;
use App\Models\Compte;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function creerUtilisateur(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'telephone' => 'nullable|string',
            'role' => 'required|in:encadrant,stagiaire',
            'filiere' => 'nullable|string',
            'departement' => 'nullable|string',
        ]);

        // Mot de passe temporaire aléatoire — sera remplacé lors de l'activation
        $data['password'] = bcrypt(Str::random(32));

        $user = User::create($data);

        $token = Str::random(60);

        $compte = Compte::create([
            'user_id' => $user->id,
            'statut' => 'en_attente',
            'date_creation' => now(),
            'token' => $token,
            'token_expire_at' => now()->addHours(24),
        ]);

        $lienActivation = env('FRONTEND_URL', 'http://localhost:5173')
            . '/definir-mot-de-passe/' . $token;

        Mail::to($user->email)->send(
            new VerificationCompteMail("{$user->prenom} {$user->nom}", $lienActivation)
        );

        return response()->json([
            'message' => 'Compte créé, email de vérification envoyé.',
            'user' => $user,
        ], 201);
    }
}