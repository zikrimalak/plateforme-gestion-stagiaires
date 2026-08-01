import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import api from '../../services/api'

function AdminModifierSujet() {
  const navigate = useNavigate()
  const [sujets, setSujets] = useState([])
  const [encadrants, setEncadrants] = useState([])
  const [sujetId, setSujetId] = useState('')
  const [form, setForm] = useState({ titre: '', description: '', encadrantId: '' })
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')

  // Chargé une seule fois, au premier affichage du composant
  useEffect(() => {
    api.get('/sujets').then((res) => setSujets(res.data)).catch(() => {})
    api.get('/admin/encadrants').then((res) => setEncadrants(res.data)).catch(() => {})
  }, [])

  // Quand on choisit un sujet dans la liste, on pré-remplit le formulaire avec ses données
  const handleSelectSujet = (e) => {
    const id = e.target.value
    setSujetId(id)
    setSucces('')
    setErreur('')

    const sujet = sujets.find((s) => s.id === Number(id))
    if (sujet) {
      setForm({
        titre: sujet.titre,
        description: sujet.description,
        encadrantId: sujet.encadrant_id,
      })
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setSucces('')
    setLoading(true)

    try {
      await api.put(`/admin/sujets/${sujetId}`, {
        titre: form.titre,
        description: form.description,
        encadrant_id: form.encadrantId,
      })
      setSucces('Sujet modifié avec succès !')
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la modification du sujet.')
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

      <h1 className="text-2xl font-semibold text-primary-dark mb-6">Modifier un sujet de stage</h1>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-lg space-y-4">
        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        {succes && <p className="text-sm text-green-600">{succes}</p>}

        <select
          value={sujetId}
          onChange={handleSelectSujet}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="" disabled>Choisir un sujet à modifier</option>
          {sujets.map((s) => (
            <option key={s.id} value={s.id}>{s.titre}</option>
          ))}
        </select>

        {sujetId && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="titre"
              value={form.titre}
              onChange={handleChange}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm resize-none"
              required
            />
            <select
              name="encadrantId"
              value={form.encadrantId}
              onChange={handleChange}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
              required
            >
              {encadrants.map((e) => (
                <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AdminModifierSujet