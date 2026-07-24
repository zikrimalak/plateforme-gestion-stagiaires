import { useNavigate } from 'react-router-dom'
import { Settings, UserCheck, GraduationCap } from 'lucide-react'
import hcpLogo from '../../assets/logohcp.jpg'
import marocLogo from '../../assets/logomaroc.jpg'

function Accueil() {
  const navigate = useNavigate()

  const espaces = [
    { role: 'admin', label: 'Espace admin', Icon: Settings },
    { role: 'encadrant', label: 'Espace encadrant', Icon: UserCheck },
    { role: 'stagiaire', label: 'Espace stagiaire', Icon: GraduationCap },
  ]

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center">
      {/* Bandeau des deux logos, aux extrémités */}
      <div className="w-full flex items-center justify-between px-6 sm:px-12 pt-6">
        <img src={hcpLogo} alt="HCP" className="h-24 sm:h-32 object-contain" />
        <img src={marocLogo} alt="Royaume du Maroc" className="h-24 sm:h-32 object-contain" />
      </div>

      <div className="flex-1 flex flex-col items-center pt-2 sm:pt-4 gap-8 sm:gap-12 px-4 sm:px-6 pb-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark text-center">
            Plateforme de gestion des stages
          </h1>
          <p className="italic text-sm sm:text-base text-neutral-500 text-center max-w-md">
            Une plateforme centralisée pour faciliter la gestion et le suivi des stages
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          {espaces.map((espace) => (
            <div
              key={espace.role}
              onClick={() => navigate(`/login/${espace.role}`)}
              className={`bg-yellow-50 rounded-xl p-6 text-center cursor-pointer transition-all border shadow-sm hover:shadow-md
                ${espace.role === 'stagiaire' ? 'border-2 border-accent' : 'border-neutral-200 hover:border-primary'}`}
            >
              <espace.Icon className="mx-auto mb-3 text-primary" size={28} />
              <p className="text-sm font-medium text-neutral-800">{espace.label}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs text-neutral-400 text-center mt-auto pt-8">
          © Haut-Commissariat au Plan — Plateforme de gestion des stages
        </p>
      </div>
    </div>
  )
}

export default Accueil