<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 30px;">
    <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px;">
        <h2 style="color: #6D28D9;">Bienvenue, {{ $nomComplet }}</h2>
        <p style="color: #444;">
            Votre compte a été créé sur la plateforme de gestion des stagiaires du HCP.
            Cliquez sur le bouton ci-dessous pour définir votre mot de passe et activer votre compte.
        </p>
        <a href="{{ $lienActivation }}"
           style="display: inline-block; background: #6D28D9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 15px;">
            Activer mon compte
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 25px;">
            Ce lien expire dans 24 heures. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
        </p>
    </div>
</body>
</html>