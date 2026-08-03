import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ListTodo, AlertTriangle, Lightbulb, Send, CheckCircle2, Clock } from "lucide-react";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

export default function StagiaireSuiviHebdo() {
  const navigate = useNavigate();
  const [historique, setHistorique] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [form, setForm] = useState({ taches: "", difficultes: "", solutions: "" });

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await api.get("/mes-suivis-hebdo");
        setHistorique(res.data);
      } catch (err) {
        setErreur("Impossible de charger ton historique.");
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnvoiEnCours(true);
    setErreur("");

    try {
      const res = await api.post("/suivis-hebdo", form);
      setHistorique([res.data, ...historique]);
      setForm({ taches: "", difficultes: "", solutions: "" });
    } catch (err) {
      setErreur("L'envoi du suivi a échoué.");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <>
      <Navbar role="Stagiaire" />
      <div className="min-h-screen bg-neutral-100 p-6">
        <button
          onClick={() => navigate("/stagiaire/dashboard")}
          className="flex items-center gap-2 text-primary hover:text-primary-dark transition mb-6"
        >
          <ArrowLeft size={18} />
          Retour au tableau de bord
        </button>

        <h1 className="text-2xl font-bold text-neutral-800 mb-1">Suivi hebdomadaire</h1>
        <p className="text-neutral-500 mb-6">
          Renseigne tes avancements de la semaine. Ton encadrant validera ton suivi.
        </p>

        {erreur && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4 mb-8">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
              <ListTodo size={18} className="text-primary" />
              Tâches réalisées cette semaine
            </label>
            <textarea
              name="taches"
              value={form.taches}
              onChange={handleChange}
              rows={3}
              placeholder="Décris ce que tu as accompli..."
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
              <AlertTriangle size={18} className="text-primary" />
              Difficultés rencontrées
            </label>
            <textarea
              name="difficultes"
              value={form.difficultes}
              onChange={handleChange}
              rows={3}
              placeholder="Quels blocages as-tu rencontrés ?"
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
              <Lightbulb size={18} className="text-primary" />
              Solutions apportées
            </label>
            <textarea
              name="solutions"
              value={form.solutions}
              onChange={handleChange}
              rows={3}
              placeholder="Comment as-tu résolu (ou comptes-tu résoudre) ces difficultés ?"
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={envoiEnCours}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg transition hover:scale-[1.02] disabled:opacity-60"
          >
            <Send size={18} />
            {envoiEnCours ? "Envoi en cours..." : "Soumettre le suivi de la semaine"}
          </button>
        </form>

        <p className="text-sm font-semibold text-neutral-500 tracking-wide mb-3">HISTORIQUE</p>

        {chargement ? (
          <p className="text-neutral-400 text-sm">Chargement...</p>
        ) : (
          <div className="space-y-4">
            {historique.map((entree) => (
              <div key={entree.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-neutral-800">{entree.semaine}</h3>

                  {entree.statut === "valide" ? (
                    <span className="flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
                      <CheckCircle2 size={14} /> Validé
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-yellow-50 text-accent-dark text-xs font-medium px-3 py-1 rounded-full">
                      <Clock size={14} /> En attente
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-neutral-600">
                  <p><span className="font-medium text-neutral-700">Tâches :</span> {entree.taches}</p>
                  {entree.difficultes && (
                    <p><span className="font-medium text-neutral-700">Difficultés :</span> {entree.difficultes}</p>
                  )}
                  {entree.solutions && (
                    <p><span className="font-medium text-neutral-700">Solutions :</span> {entree.solutions}</p>
                  )}
                  {entree.commentaire && (
                    <p className="italic text-neutral-500">Remarque de l'encadrant : "{entree.commentaire}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}