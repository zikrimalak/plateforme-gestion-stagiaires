import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'

function Login() {
  const navigate = useNavigate()
  const { role } = useParams()

  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setErreur('')
    console.log('Connexion tentée pour', role, email, motDePasse)
  }

  const titres = {
    admin: 'Connexion Administrateur',
    encadrant: 'Connexion Encadrant',
    stagiaire: 'Connexion Stagiaire',
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center pt-8 sm:pt-16 gap-8 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-primary-dark text-center">
        {titres[role] || 'Connexion'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full border border-neutral-200 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Email</label>
          <div className="flex items-center gap-2 border border-neutral-300 rounded-lg px-3 py-2 focus-within:border-primary">
            <Mail size={18} className="text-primary" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hcp.ma"
              required
              className="w-full outline-none text-sm text-neutral-800"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">Mot de passe</label>
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

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white font-medium rounded-lg py-2.5 transition-colors"
        >
          Se connecter
        </button>

        <button
          type="button"
          onClick={() => navigate('/mot-de-passe-oublie')}
          className="text-sm text-accent-dark hover:underline text-center"
        >
          Mot de passe oublié ?
        </button>
      </form>
    </div>
  )
}

export default Login