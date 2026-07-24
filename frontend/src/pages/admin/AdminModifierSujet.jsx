import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function AdminModifierSujet() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="flex items-center gap-1 text-sm text-neutral-600 hover:text-primary mb-6"
      >
        <ArrowLeft size={16} /> Retour au dashboard
      </button>

      <h1 className="text-2xl font-semibold text-primary-dark mb-6">Modifier un sujet de stage</h1>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-lg">
        <p className="text-sm text-neutral-500">Liste des sujets à venir — logique backend non encore branchée.</p>
      </div>
    </div>
  )
}

export default AdminModifierSujet