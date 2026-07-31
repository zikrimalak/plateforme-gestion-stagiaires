<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('documents', function (Blueprint $table) {
    $table->id();
    $table->foreignId('stagiaire_id')->constrained('users')->onDelete('cascade');
    $table->string('type');
    $table->string('nom_fichier');
    $table->string('chemin_fichier');
    $table->enum('statut', ['en_attente', 'valide', 'refuse'])->default('en_attente');
    $table->text('commentaire')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
