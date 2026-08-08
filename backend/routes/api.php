<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\SujetController;
use App\Http\Controllers\Api\CandidatureController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\Api\SuiviHebdomadaireController;
use App\Http\Controllers\StageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AgentIAController;
use App\Http\Controllers\NotificationController;
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
    Route::get('/admin/dashboard-stats', [DashboardController::class, 'admin']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/candidatures', [CandidatureController::class, 'store']);

    Route::middleware('role:encadrant')->group(function () {
        Route::get('/encadrant/candidatures', [CandidatureController::class, 'index']);
        Route::post('/encadrant/candidatures/{id}/accepter', [CandidatureController::class, 'accepter']);
        Route::post('/encadrant/candidatures/{id}/refuser', [CandidatureController::class, 'refuser']);
        Route::get('/encadrant/dashboard-stats', [DashboardController::class, 'encadrant']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/mes-documents', [DocumentController::class, 'mesDocuments']);
    Route::get('/documents/{id}/download', [DocumentController::class, 'telecharger']);
});

Route::middleware(['auth:sanctum', 'role:encadrant'])->group(function () {
    Route::get('/encadrant/documents', [DocumentController::class, 'index']);
    Route::patch('/encadrant/documents/{id}', [DocumentController::class, 'update']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/suivis-hebdo', [SuiviHebdomadaireController::class, 'store']);
    Route::get('/mes-suivis-hebdo', [SuiviHebdomadaireController::class, 'mesSuivis']);
});

Route::middleware(['auth:sanctum', 'role:encadrant'])->group(function () {
    Route::get('/encadrant/suivis-hebdo', [SuiviHebdomadaireController::class, 'index']);
    Route::patch('/encadrant/suivis-hebdo/{id}', [SuiviHebdomadaireController::class, 'update']);
});

// Dashboard + gestion des dates du stagiaire
Route::middleware(['auth:sanctum', 'role:stagiaire'])->group(function () {
    Route::get('/stagiaire/dashboard-data', [DashboardController::class, 'stagiaire']);
    Route::patch('/mon-stage/dates', [StageController::class, 'mettreAJourDates']);
});

Route::middleware(['auth:sanctum', 'role:stagiaire'])->group(function () {
    Route::get('/stagiaire/dashboard-data', [DashboardController::class, 'stagiaire']);
    Route::patch('/mon-stage/dates', [StageController::class, 'mettreAJourDates']);
    Route::get('/stagiaire/sujets-recommandes', [AgentIAController::class, 'sujetsRecommandes']);
    Route::get('/mes-notifications', [NotificationController::class, 'mesNotifications']);
});