import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ListTodo, AlertTriangle, Lightbulb, Send, CheckCircle2, Clock } from "lucide-react";
import Navbar from "../../components/common/Navbar";

// TODO: remplacer par un vrai fetch axios une fois le backend branché
const historiqueInitial = [
  {
    id: 1,
    semaine: "Semaine du 14 au 18 juillet 2026",
    taches: "Mise en place de la Navbar, du dashboard admin et des composants réutilisables.",
    difficultes: "Difficulté à centrer les icônes dans les inputs.",
    solutions: "Utilisation de position relative/absolute avec Tailwind.",
    statut: "valide",
  },
  {
    id: 2,
    semaine: "Semaine du 21 au 25 juillet 2026",
    taches: "Construction du dashboard stagiaire et de l'agent IA.",
    difficultes: "Organisation du composant chat en state séparé.",
    solutions: "Séparation en composant AgentIAChat réutilisable.",
    statut: "en_attente",
  },
];

export default function StagiaireSuiviHebdo() {
  const navigate = useNavigate();
  const [historique, setHistorique] = useState(historiqueInitial);
  const [form, setForm] = useState({ taches: "", difficultes: "", solutions: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: appel axios vers le backend (POST /api/stagiaire/suivi-hebdo)
    const nouvelleEntree = {
      id: historique.length + 1,
      semaine: "Semaine en cours",
      taches: form.taches,
      difficultes: form.difficultes,
      solutions: form.solutions,
      statut: "en_attente",
    };

    setHistorique([nouvelleEntree, ...historique]);
    setForm({ taches: "", difficultes: "", solutions: "" });
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

        {/* Formulaire de saisie */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-6 space-y-4 mb-8"
        >
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
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg transition hover:scale-[1.02]"
          >
            <Send size={18} />
            Soumettre le suivi de la semaine
          </button>
        </form>

        {/* Historique */}
        <p className="text-sm font-semibold text-neutral-500 tracking-wide mb-3">HISTORIQUE</p>
        <div className="space-y-4">
          {historique.map((entree) => (
            <div
              key={entree.id}
              className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-neutral-800">{entree.semaine}</h3>

                {entree.statut === "valide" ? (
                  <span className="flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
                    <CheckCircle2 size={14} />
                    Validé
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-yellow-50 text-accent-dark text-xs font-medium px-3 py-1 rounded-full">
                    <Clock size={14} />
                    En attente
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}