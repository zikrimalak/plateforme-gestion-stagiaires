<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Compte;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Identifiants incorrects.'],
        ]);
    }

    // Vérifier si le compte est activé
    if ($user->compte && $user->compte->statut !== 'actif') {
        throw ValidationException::withMessages([
            'email' => ['Ce compte n\'est pas encore activé.'],
        ]);
    }

    // Créer le token uniquement si le compte est actif
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
    ]);
}

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
    

public function verifierToken(string $token)
{
    $compte = Compte::where('token', $token)->first();

    if (! $compte) {
        return response()->json(['message' => 'Lien invalide.'], 404);
    }

    if ($compte->statut === 'actif') {
        return response()->json(['message' => 'Ce compte est déjà activé.'], 400);
    }

    if ($compte->token_expire_at && now()->greaterThan($compte->token_expire_at)) {
        return response()->json(['message' => 'Ce lien a expiré.'], 410);
    }

    return response()->json(['message' => 'Token valide.']);
}

public function activerCompte(Request $request, string $token)
{
    $request->validate([
        'password' => 'required|min:8|confirmed',
    ]);

    $compte = Compte::where('token', $token)->first();

    if (! $compte || $compte->statut === 'actif') {
        return response()->json(['message' => 'Lien invalide ou déjà utilisé.'], 400);
    }

    if ($compte->token_expire_at && now()->greaterThan($compte->token_expire_at)) {
        return response()->json(['message' => 'Ce lien a expiré.'], 410);
    }

    $compte->user->update(['password' => bcrypt($request->password)]);

    $compte->update([
        'statut' => 'actif',
        'date_activation' => now(),
        'token' => null,
        'token_expire_at' => null,
    ]);

    return response()->json(['message' => 'Compte activé avec succès.']);
}
}