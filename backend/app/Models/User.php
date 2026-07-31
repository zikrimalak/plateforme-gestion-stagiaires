<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'password',
        'role',
        'filiere',
        'departement',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ─────────────────────────────
    // Relations
    // ─────────────────────────────

    public function sujetsEncadres()
    {
        return $this->hasMany(Sujet::class, 'encadrant_id');
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class, 'stagiaire_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'stagiaire_id');
    }

    public function compte()
    {
        return $this->hasOne(Compte::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function remarquesRecues()
    {
        return $this->hasMany(Remarque::class, 'stagiaire_id');
    }

    public function remarquesEcrites()
    {
        return $this->hasMany(Remarque::class, 'encadrant_id');
    }
}