import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Lock, CheckCircle } from 'lucide-react'

function DefinirMotDePasse() {
  const { token } = useParams()

  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setErreur('')

    if (motDePasse.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    if (motDePasse !== confirmation) {
      setErreur('Les deux mots de passe ne correspondent pas')
      return
    }
    console.log('Mot de passe défini avec le token', token)
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center pt-8 sm:pt-16 gap-8 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-primary-dark text-center">
        Définir votre mot de passe
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full border border-neutral-200 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Nouveau mot de passe</label>
          <div className="flex items-center gap-2 border border-neutral-300 rounded-lg px-3 py-2 focus-within:border-primary">
            <Lock size={18} className="text-primary" />
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full outline-none text-sm text-neutral-800"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Confirmer le mot de passe</label>
          <div className="flex items-center gap-2 border border-neutral-300 rounded-lg px-3 py-2 focus-within:border-primary">
            <CheckCircle size={18} className="text-primary" />
            <input
              type="password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full outline-none text-sm text-neutral-800"
            />
          </div>
        </div>

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white font-medium rounded-lg py-2.5 transition-colors"
        >
          Valider
        </button>
      </form>
    </div>
  )
}

export default DefinirMotDePasse