import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import api from '../../services/api'

function AdminSupprimerSujet() {
  const navigate = useNavigate()
  const [sujets, setSujets] = useState([])
  const [sujetId, setSujetId] = useState('')
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')

  useEffect(() => {
    api.get('/sujets').then((res) => setSujets(res.data)).catch(() => {})
  }, [])

  const handleDelete = async () => {
    if (!window.confirm('Supprimer ce sujet définitivement ?')) return

    setErreur('')
    setSucces('')
    setLoading(true)

    try {
      await api.delete(`/admin/sujets/${sujetId}`)
      setSucces('Sujet supprimé avec succès !')
      setSujets(sujets.filter((s) => s.id !== Number(sujetId)))
      setSujetId('')
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la suppression.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="flex items-center gap-1 text-sm text-neutral-600 hover:text-primary mb-6"
      >
        <ArrowLeft size={16} /> Retour au dashboard
      </button>

      <h1 className="text-2xl font-semibold text-primary-dark mb-6">Supprimer un sujet de stage</h1>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-lg space-y-4">
        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        {succes && <p className="text-sm text-green-600">{succes}</p>}

        <select
          value={sujetId}
          onChange={(e) => setSujetId(e.target.value)}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="" disabled>Choisir un sujet à supprimer</option>
          {sujets.map((s) => (
            <option key={s.id} value={s.id}>{s.titre}</option>
          ))}
        </select>

        <button
          onClick={handleDelete}
          disabled={!sujetId || loading}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50"
        >
          <Trash2 size={16} />
          {loading ? 'Suppression...' : 'Supprimer le sujet'}
        </button>
      </div>
    </div>
  )
}

export default AdminSupprimerSujet