<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationCompteMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $nomComplet,
        public string $lienActivation,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Activez votre compte — Gestion des Stages HCP',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.verification-compte',
        );
    }
}