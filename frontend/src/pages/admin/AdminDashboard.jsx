import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { UserPlus, UserCheck, FilePlus, UserMinus, UserX, FileMinus, FileEdit, CheckCircle, Archive } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import ActionCard from '../../components/common/ActionCard'
import StatCard from '../../components/common/StatCard'

function AdminDashboard() {
  const navigate = useNavigate()

  // TODO : remplacer par un appel axios vers ton backend Laravel
  const stagesActifs = 12
  const stagesTermines = 8
  const stagiairesParEncadrant = [
    { encadrant: 'Anas Bodor', nombre: 4 },
    { encadrant: 'Sara Alaoui', nombre: 3 },
    { encadrant: 'Karim Idrissi', nombre: 5 },
  ]

  const actions = [
    { label: 'Ajouter stagiaire', Icon: UserPlus, path: '/admin/stagiaires/ajouter' },
    { label: 'Ajouter encadrant', Icon: UserCheck, path: '/admin/encadrants/ajouter' },
    { label: 'Ajouter sujet', Icon: FilePlus, path: '/admin/sujets/ajouter' },
    { label: 'Modifier sujet', Icon: FileEdit, path: '/admin/sujets/modifier' },
    { label: 'Supprimer stagiaire', Icon: UserMinus, path: '/admin/stagiaires/supprimer', variant: 'danger' },
    { label: 'Supprimer encadrant', Icon: UserX, path: '/admin/encadrants/supprimer', variant: 'danger' },
    { label: 'Supprimer sujet', Icon: FileMinus, path: '/admin/sujets/supprimer', variant: 'danger' },
  ]

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 sm:p-8 flex flex-col gap-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark">Vue d'ensemble</h1>

        {/* Actions de gestion */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {actions.map((action) => (
              <ActionCard
                key={action.label}
                label={action.label}
                Icon={action.Icon}
                variant={action.variant}
                onClick={() => navigate(action.path)}
              />
            ))}
          </div>
        </section>

        {/* Statistiques */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Statistiques</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              label="Stages actifs"
              value={stagesActifs}
              Icon={CheckCircle}
              color="primary"
              to="/admin/stages/actifs"
            />
            <StatCard
              label="Stages terminés"
              value={stagesTermines}
              Icon={Archive}
              color="accent"
              to="/admin/stages/termines"
            />
          </div>
        </section>

        {/* Graphique */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
            Stagiaires par encadrant
          </h2>
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stagiairesParEncadrant}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="encadrant" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="nombre" fill="#6D28D9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard