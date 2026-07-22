import { useNavigate } from 'react-router-dom'
import { Settings, UserCheck, GraduationCap } from 'lucide-react'
import hcpLogo from '../../assets/logohcp.jpg'

function Accueil() {
  // useNavigate() est un "hook" fourni par react-router-dom
  // il retourne une fonction qu'on peut appeler pour changer de page en JS
  const navigate = useNavigate()

  // On regroupe les infos des 3 espaces dans un tableau
  // plutôt que de répéter 3 fois le même bloc JSX
  const espaces = [
    { role: 'admin', label: 'Espace admin', Icon: Settings },
    { role: 'encadrant', label: 'Espace encadrant', Icon: UserCheck },
    { role: 'stagiaire', label: 'Espace stagiaire', Icon: GraduationCap },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center pt-8 sm:pt-16 gap-8 sm:gap-12 px-4 sm:px-6">
       {/* Logos en haut */}
      <div className="flex items-center gap-8">
        <img src={hcpLogo} alt="HCP" className="h-20 sm:h-32 object-contain mb-4" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-primary-dark text-center">
        Plateforme de gestion des stages
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        {espaces.map((espace) => (
          <div
            key={espace.role}
            onClick={() => navigate(`/login/${espace.role}`)}
            className={`bg-white rounded-xl p-6 text-center cursor-pointer transition-colors border
              ${espace.role === 'stagiaire' ? 'border-2 border-accent' : 'border-neutral-200 hover:border-primary'}`}
          >
            <espace.Icon className="mx-auto mb-3 text-primary" size={28} />
            <p className="text-sm font-medium text-neutral-800">{espace.label}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Accueil