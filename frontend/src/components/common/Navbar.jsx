// components/common/Navbar.jsx
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import hcpLogo from '../../assets/logohcp.jpg'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="w-full bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo + nom */}
        <div className="flex items-center gap-3">
          <img src={hcpLogo} alt="HCP" className="h-10 object-contain" />
          <span className="hidden sm:block font-semibold text-primary-dark">
            Gestion des stages
          </span>
        </div>

        {/* Liens de navigation */}
        <div className="hidden sm:flex items-center gap-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors"
          >
            Accueil
          </button>
          <button
            onClick={() => navigate('/admin/a-propos')}
            className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors"
          >
            À propos
          </button>
        </div>

        {/* Profil admin */}
        <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 rounded-full pl-2 pr-3 py-1.5 transition-colors">
          <div className="bg-primary rounded-full p-1.5">
            <User size={16} className="text-white" />
          </div>
          <span className="hidden sm:block text-sm font-medium text-primary-dark">Admin</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar