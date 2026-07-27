import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, BookOpen, Check, X, Clock, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "../../components/common/Navbar";

// TODO: remplacer par un vrai fetch axios une fois le backend branché
const candidaturesInitiales = [
  {
    id: 1,
    stagiaire: "Malak Idrissi",
    sujetId: 1,
    sujetTitre: "Développement d'une plateforme de gestion des stagiaires",
    date: "20 juillet 2026",
    statut: "en_attente",
  },
  {
    id: 2,
    stagiaire: "Yassine Amrani",
    sujetId: 1,
    sujetTitre: "Développement d'une plateforme de gestion des stagiaires",
    date: "21 juillet 2026",
    statut: "en_attente",
  },
  {
    id: 3,
    stagiaire: "Salma Bennis",
    sujetId: 2,
    sujetTitre: "Automatisation de la collecte de données statistiques",
    date: "19 juillet 2026",
    statut: "en_attente",
  },
];

export default function EncadrantCandidatures() {
  const navigate = useNavigate();
  const [candidatures, setCandidatures] = useState(candidaturesInitiales);

  const accepter = (candidature) => {
    // TODO: axios PATCH vers le backend — accepte cette candidature
    // et verrouille le sujet pour toutes les autres (le backend doit
    // appliquer la même règle côté serveur, pas seulement ici)
    setCandidatures((prev) =>
      prev.map((c) => {
        if (c.id === candidature.id) return { ...c, statut: "acceptee" };
        if (c.sujetId === candidature.sujetId && c.statut === "en_attente") {
          return { ...c, statut: "refusee" };
        }
        return c;
      })
    );
  };

  const refuser = (id) => {
    // TODO: axios PATCH vers le backend
    setCandidatures((prev) =>
      prev.map((c) => (c.id === id ? { ...c, statut: "refusee" } : c))
    );
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

        <h1 className="text-2xl font-bold text-neutral-800 mb-1">Candidatures</h1>
        <p className="text-neutral-500 mb-6">
          Accepter une candidature verrouille le sujet pour les autres stagiaires.
        </p>

        <div className="space-y-4">
          {candidatures.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User size={16} className="text-primary" />
                  <span className="font-semibold text-neutral-800">{c.stagiaire}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                  <BookOpen size={14} className="text-primary" />
                  {c.sujetTitre}
                </div>
                <p className="text-xs text-neutral-400">Candidature du {c.date}</p>
              </div>

              {c.statut === "en_attente" && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => accepter(c)}
                    className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                  >
                    <Check size={16} />
                    Accepter
                  </button>
                  <button
                    onClick={() => refuser(c.id)}
                    className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium px-4 py-2 rounded-lg transition"
                  >
                    <X size={16} />
                    Refuser
                  </button>
                </div>
              )}

              {c.statut === "acceptee" && (
                <span className="flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-3 py-1.5 rounded-full shrink-0">
                  <CheckCircle2 size={14} />
                  Acceptée
                </span>
              )}

              {c.statut === "refusee" && (
                <span className="flex items-center gap-1 bg-neutral-100 text-neutral-500 text-xs font-medium px-3 py-1.5 rounded-full shrink-0">
                  <XCircle size={14} />
                  Refusée
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}