<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;

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
