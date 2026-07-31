import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Lock, CheckCircle } from 'lucide-react'
import api from '../../services/api'

function DefinirMotDePasse() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)
  const [succes, setSucces] = useState(false)
  const [tokenValide, setTokenValide] = useState(null) // null = en cours de vérification

  // Vérifie le token dès l'arrivée sur la page, avant même que l'utilisateur saisisse quoi que ce soit
  useEffect(() => {
    async function verifier() {
      try {
        await api.get(`/verifier-token/${token}`)
        setTokenValide(true)
      } catch (err) {
        setTokenValide(false)
      }
    }
    verifier()
  }, [token])

  const handleSubmit = async (e) => {
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

    setChargement(true)
    try {
      await api.post(`/activer-compte/${token}`, { password: motDePasse, password_confirmation: confirmation, })
      setSucces(true)
      setTimeout(() => navigate('/login/stagiaire'), 2000)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Une erreur est survenue, réessayez')
    } finally {
      setChargement(false)
    }
  }

  // --- États d'affichage particuliers ---

  if (tokenValide === null) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <p className="text-neutral-600">Vérification du lien...</p>
      </div>
    )
  }

  if (tokenValide === false) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <p className="text-red-600 text-center">
          Ce lien d'activation est invalide ou a expiré. Contactez l'administrateur.
        </p>
      </div>
    )
  }

  if (succes) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <p className="text-green-600 text-center">
          Compte activé avec succès ! Redirection vers la connexion...
        </p>
      </div>
    )
  }

  // --- Formulaire normal ---

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
          disabled={chargement}
          className="bg-primary hover:bg-primary-dark text-white font-medium rounded-lg py-2.5 transition-colors disabled:opacity-50"
        >
          {chargement ? 'Validation...' : 'Valider'}
        </button>
      </form>
    </div>
  )
}

export default DefinirMotDePasse