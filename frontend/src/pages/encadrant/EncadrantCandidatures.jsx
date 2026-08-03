import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, BookOpen, Check, X, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

export default function EncadrantCandidatures() {
  const navigate = useNavigate();
  const [candidatures, setCandidatures] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const charger = async () => {
    try {
      const res = await api.get("/encadrant/candidatures");
      setCandidatures(res.data);
    } catch (err) {
      setErreur("Impossible de charger les candidatures.");
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const accepter = async (id) => {
    try {
      await api.post(`/encadrant/candidatures/${id}/accepter`);
      // on recharge depuis le backend plutôt que de deviner l'état côté React,
      // pour refléter fidèlement le verrouillage + refus automatique fait côté serveur
      charger();
    } catch (err) {
      setErreur("L'acceptation a échoué.");
    }
  };

  const refuser = async (id) => {
    try {
      await api.post(`/encadrant/candidatures/${id}/refuser`);
      charger();
    } catch (err) {
      setErreur("Le refus a échoué.");
    }
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

        {erreur && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {erreur}
          </div>
        )}

        {chargement ? (
          <p className="text-neutral-400 text-sm">Chargement...</p>
        ) : candidatures.length === 0 ? (
          <p className="text-neutral-400 text-sm">Aucune candidature reçue pour l'instant.</p>
        ) : (
          <div className="space-y-4">
            {candidatures.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User size={16} className="text-primary" />
                    <span className="font-semibold text-neutral-800">
                      {c.stagiaire?.prenom} {c.stagiaire?.nom}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                    <BookOpen size={14} className="text-primary" />
                    {c.sujet?.titre}
                  </div>
                  <p className="text-xs text-neutral-400">
                    Candidature du {new Date(c.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                {c.statut === "en_attente" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => accepter(c.id)}
                      className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                    >
                      <Check size={16} /> Accepter
                    </button>
                    <button
                      onClick={() => refuser(c.id)}
                      className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium px-4 py-2 rounded-lg transition"
                    >
                      <X size={16} /> Refuser
                    </button>
                  </div>
                )}

                {c.statut === "acceptee" && (
                  <span className="flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-3 py-1.5 rounded-full shrink-0">
                    <CheckCircle2 size={14} /> Acceptée
                  </span>
                )}

                {c.statut === "refusee" && (
                  <span className="flex items-center gap-1 bg-neutral-100 text-neutral-500 text-xs font-medium px-3 py-1.5 rounded-full shrink-0">
                    <XCircle size={14} /> Refusée
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}