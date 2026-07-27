import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Menu, X } from 'lucide-react'
import hcpLogo from '../../assets/logohcp.jpg'

function Navbar({ role = 'Admin' }) {
  const navigate = useNavigate()
  const [menuOuvert, setMenuOuvert] = useState(false)

  const cheminsDashboard = {
    Admin: '/admin/dashboard',
    Encadrant: '/encadrant/dashboard',
    Stagiaire: '/stagiaire/dashboard',
  }

  const liens = [
    { label: 'Accueil', path: cheminsDashboard[role] },
    { label: 'À propos', path: '/admin/a-propos' },
  ]

  const allerVers = (path) => {
    navigate(path)
    setMenuOuvert(false) // referme le menu après avoir cliqué sur un lien
  }

  return (
    <nav className="w-full bg-white border-b border-neutral-200 shadow-sm relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo + nom */}
        <div className="flex items-center gap-3">
          <img src={hcpLogo} alt="HCP" className="h-10 object-contain" />
          <span className="hidden sm:block font-semibold text-primary-dark">
            Gestion des stages
          </span>
        </div>

        {/* Liens de navigation — visibles seulement à partir de sm: */}
        <div className="hidden sm:flex items-center gap-6">
          {liens.map((lien) => (
            <button
              key={lien.path}
              onClick={() => allerVers(lien.path)}
              className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors"
            >
              {lien.label}
            </button>
          ))}
        </div>

        {/* Groupe droite : profil + bouton hamburger (mobile only) */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 rounded-full pl-2 pr-3 py-1.5 transition-colors">
            <div className="bg-primary rounded-full p-1.5">
              <User size={16} className="text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-primary-dark">{role}</span>
          </button>

          {/* Bouton hamburger — visible seulement sur mobile */}
          <button
            onClick={() => setMenuOuvert(!menuOuvert)}
            className="sm:hidden p-2 text-neutral-700 hover:text-primary"
          >
            {menuOuvert ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu déroulant mobile */}
      {menuOuvert && (
        <div className="sm:hidden bg-white border-t border-neutral-200 flex flex-col">
          {liens.map((lien) => (
            <button
              key={lien.path}
              onClick={() => allerVers(lien.path)}
              className="text-left px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors"
            >
              {lien.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar