<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\SujetController;

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