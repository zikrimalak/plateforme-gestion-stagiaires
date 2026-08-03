import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, ListTodo, AlertTriangle, Lightbulb, CheckCircle2, Clock, MessageSquare,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

export default function EncadrantSuiviHebdo() {
  const navigate = useNavigate();
  const [suivis, setSuivis] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [commentaireOuvert, setCommentaireOuvert] = useState(null);
  const [brouillon, setBrouillon] = useState("");

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await api.get("/encadrant/suivis-hebdo");
        setSuivis(res.data);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const majSuivi = async (id, champs) => {
    const res = await api.patch(`/encadrant/suivis-hebdo/${id}`, champs);
    setSuivis((prev) => prev.map((s) => (s.id === id ? res.data : s)));
  };

  const valider = (id) => majSuivi(id, { statut: "valide" });

  const ouvrirCommentaire = (suivi) => {
    setCommentaireOuvert(suivi.id);
    setBrouillon(suivi.commentaire || "");
  };

  const enregistrerCommentaire = async (id) => {
    await majSuivi(id, { commentaire: brouillon });
    setCommentaireOuvert(null);
    setBrouillon("");
  };

  return (
    <>
      <Navbar role="Encadrant" />
      <div className="min-h-screen bg-neutral-100 p-6">
        <button
          onClick={() => navigate("/encadrant/dashboard")}
          className="flex items-center gap-2 text-primary hover:text-primary-dark transition mb-6"
        >
          <ArrowLeft size={18} />
          Retour au tableau de bord
        </button>

        <h1 className="text-2xl font-bold text-neutral-800 mb-1">Suivi hebdomadaire</h1>
        <p className="text-neutral-500 mb-6">
          Consulte et commente les suivis déposés par tes stagiaires.
        </p>

        {chargement ? (
          <p className="text-neutral-400 text-sm">Chargement...</p>
        ) : suivis.length === 0 ? (
          <p className="text-neutral-400 text-sm">Aucun suivi déposé pour l'instant.</p>
        ) : (
          <div className="space-y-4">
            {suivis.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User size={16} className="text-primary" />
                      <span className="font-semibold text-neutral-800">
                        {s.stagiaire?.prenom} {s.stagiaire?.nom}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500">{s.semaine}</p>
                  </div>

                  {s.statut === "valide" ? (
                    <span className="flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-3 py-1.5 rounded-full shrink-0 self-start">
                      <CheckCircle2 size={14} /> Validé
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-yellow-50 text-accent-dark text-xs font-medium px-3 py-1.5 rounded-full shrink-0 self-start">
                      <Clock size={14} /> En attente
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-neutral-600 mb-3">
                  <p className="flex items-start gap-2">
                    <ListTodo size={15} className="text-primary mt-0.5 shrink-0" />
                    <span><span className="font-medium text-neutral-700">Tâches :</span> {s.taches}</span>
                  </p>
                  {s.difficultes && (
                    <p className="flex items-start gap-2">
                      <AlertTriangle size={15} className="text-primary mt-0.5 shrink-0" />
                      <span><span className="font-medium text-neutral-700">Difficultés :</span> {s.difficultes}</span>
                    </p>
                  )}
                  {s.solutions && (
                    <p className="flex items-start gap-2">
                      <Lightbulb size={15} className="text-primary mt-0.5 shrink-0" />
                      <span><span className="font-medium text-neutral-700">Solutions :</span> {s.solutions}</span>
                    </p>
                  )}
                </div>

                {s.commentaire && commentaireOuvert !== s.id && (
                  <div className="bg-neutral-50 rounded-lg px-3 py-2 mb-3 flex items-start gap-2">
                    <MessageSquare size={14} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-neutral-600">{s.commentaire}</p>
                  </div>
                )}

                {commentaireOuvert === s.id && (
                  <div className="mb-3">
                    <textarea
                      value={brouillon}
                      onChange={(e) => setBrouillon(e.target.value)}
                      rows={2}
                      placeholder="Laisser une remarque pour le stagiaire..."
                      className="w-full text-sm px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition resize-none mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => enregistrerCommentaire(s.id)}
                        className="bg-primary hover:bg-primary-dark text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => setCommentaireOuvert(null)}
                        className="text-neutral-500 hover:text-neutral-700 text-xs font-medium px-3 py-1.5 transition"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100">
                  {s.statut === "en_attente" && (
                    <button
                      onClick={() => valider(s.id)}
                      className="flex items-center gap-1.5 text-green-600 hover:text-green-700 text-sm"
                    >
                      <CheckCircle2 size={16} /> Valider
                    </button>
                  )}

                  {commentaireOuvert !== s.id && (
                    <button
                      onClick={() => ouvrirCommentaire(s)}
                      className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-700 text-sm"
                    >
                      <MessageSquare size={16} />
                      {s.commentaire ? "Modifier la remarque" : "Laisser une remarque"}
                    </button>
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