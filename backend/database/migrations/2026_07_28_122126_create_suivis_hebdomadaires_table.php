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
        Schema::create('suivis_hebdomadaires', function (Blueprint $table) {
    $table->id();
    $table->foreignId('stagiaire_id')->constrained('users')->onDelete('cascade');
    $table->string('semaine');
    $table->text('taches');
    $table->text('difficultes')->nullable();
    $table->text('solutions')->nullable();
    $table->enum('statut', ['en_attente', 'valide'])->default('en_attente');
    $table->text('commentaire')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suivis_hebdomadaires');
    }
};
