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
        Schema::create('stages', function (Blueprint $table) {
    $table->id();
    $table->foreignId('sujet_id')->constrained('sujets')->onDelete('cascade');
    $table->foreignId('candidature_id')->nullable()->constrained('candidatures')->onDelete('set null');
    $table->date('date_debut')->nullable();
    $table->date('date_fin')->nullable();
    $table->string('statut')->default('en_cours'); // en_cours / termine
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stages');
    }
};
