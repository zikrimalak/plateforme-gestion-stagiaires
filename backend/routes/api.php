<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\SujetController;
use App\Http\Controllers\Api\CandidatureController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});
Route::post('/login', [AuthController::class, 'login']);
Route::middleware(['auth:sanctum', 'role:admin'])->get('/test-admin', function () {
    return response()->json(['message' => 'Tu es bien admin.']);
});
Route::get('/verifier-token/{token}', [AuthController::class, 'verifierToken']);
Route::post('/activer-compte/{token}', [AuthController::class, 'activerCompte']);

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::post('/utilisateurs', [AdminController::class, 'creerUtilisateur']);
});
// Accessible à tout utilisateur connecté (stagiaire, encadrant, admin)
Route::middleware('auth:sanctum')->get('/sujets', [SujetController::class, 'index']);

// Réservé à l'admin, même logique que /admin/utilisateurs
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/admin/sujets', [SujetController::class, 'store']);
    Route::put('/admin/sujets/{id}', [SujetController::class, 'update']);
    Route::delete('/admin/sujets/{id}', [SujetController::class, 'destroy']);
    Route::get('/admin/encadrants', [AdminController::class, 'listerEncadrants']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/candidatures', [CandidatureController::class, 'store']);

    Route::middleware('role:encadrant')->group(function () {
        Route::get('/encadrant/candidatures', [CandidatureController::class, 'index']);
        Route::post('/encadrant/candidatures/{id}/accepter', [CandidatureController::class, 'accepter']);
        Route::post('/encadrant/candidatures/{id}/refuser', [CandidatureController::class, 'refuser']);
    });
});