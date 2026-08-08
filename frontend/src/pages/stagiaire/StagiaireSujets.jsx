import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, AlertTriangle, Sparkles } from "lucide-react";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

const TYPES_REQUIS = ["CV", "Lettre de motivation"];

function couleurBadge(score) {
  if (score >= 70) return "bg-green-50 text-green-600";
  if (score >= 40) return "bg-orange-50 text-orange-600";
  return "bg-red-50 text-red-500";
}

export default function StagiaireSujets() {
  const navigate = useNavigate();
  const [sujets, setSujets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");
  const [postulationEnCours, setPostulationEnCours] = useState(null);
  const [messagePostulation, setMessagePostulation] = useState("");
  const [typesManquants, setTypesManquants] = useState([]);
  const [scores, setScores] = useState({}); // { sujet_id: { score, justification } }
  const [avertissementIA, setAvertissementIA] = useState("");

  useEffect(() => {
    Promise.all([api.get("/sujets"), api.get("/mes-documents")])
      .then(([resSujets, resDocuments]) => {
        setSujets(resSujets.data);

        const typesDeposes = new Set(resDocuments.data.map((doc) => doc.type));
        const manquants = TYPES_REQUIS.filter((type) => !typesDeposes.has(type));
        setTypesManquants(manquants);

        if (manquants.length === 0) {
          chargerRecommandations();
        }
      })
      .catch(() => setErreur("Impossible de charger les sujets."))
      .finally(() => setLoading(false));
  }, []);

  const chargerRecommandations = () => {
    api
      .get("/stagiaire/sujets-recommandes")
      .then((res) => {
        const map = {};
        (res.data.sujets || []).forEach((s) => {
          map[s.sujet_id] = { score: s.score, justification: s.justification };
        });
        setScores(map);
        if (res.data.avertissement) setAvertissementIA(res.data.avertissement);
      })
      .catch(() => {
        setAvertissementIA("Analyse IA momentanément indisponible.");
      });
  };

  const handlePostuler = async (sujetId) => {
    setPostulationEnCours(sujetId);
    setMessagePostulation("");
    try {
      await api.post("/candidatures", { sujet_id: sujetId });
      setMessagePostulation("Candidature envoyée avec succès !");
    } catch (err) {
      setMessagePostulation(err.response?.data?.message || "Erreur lors de la candidature.");
    } finally {
      setPostulationEnCours(null);
    }
  };

  const peutPostuler = typesManquants.length === 0;

  const sujetsTries = [...sujets].sort((a, b) => {
    const scoreA = scores[a.id]?.score;
    const scoreB = scores[b.id]?.score;
    if (scoreA == null && scoreB == null) return 0;
    if (scoreA == null) return 1;
    if (scoreB == null) return -1;
    return scoreB - scoreA;
  });

  return (
    <>
      <Navbar role="Stagiaire" />
      <div className="min-h-screen bg-neutral-100 p-6 relative">
        <button
          onClick={() => navigate("/stagiaire/dashboard")}
          className="flex items-center gap-2 text-primary hover:text-primary-dark transition mb-6"
        >
          <ArrowLeft size={18} />
          Retour au tableau de bord
        </button>

        <h1 className="text-2xl font-bold text-neutral-800 mb-1">Sujets disponibles</h1>
        <p className="text-neutral-500 mb-6">
          Consulte les sujets ouverts et leur encadrant affecté.
        </p>

        {!loading && !peutPostuler && (
          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-lg mb-6">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              Tu dois d'abord déposer ton {typesManquants.join(" et ta ")}{" "}
              avant de pouvoir postuler à un sujet.{" "}
              <button
                onClick={() => navigate("/stagiaire/depot-document")}
                className="underline font-medium hover:text-yellow-900"
              >
                Déposer maintenant
              </button>
            </div>
          </div>
        )}

        {avertissementIA && (
          <p className="text-xs text-neutral-400 mb-4">{avertissementIA}</p>
        )}

        {loading && <p className="text-neutral-500 text-sm">Chargement des sujets...</p>}
        {erreur && <p className="text-red-600 text-sm">{erreur}</p>}
        {messagePostulation && <p className="text-sm text-primary mb-4">{messagePostulation}</p>}
        {!loading && !erreur && sujets.length === 0 && (
          <p className="text-neutral-500 text-sm">Aucun sujet disponible pour le moment.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sujetsTries.map((sujet) => {
            const infoScore = scores[sujet.id];

            return (
              <div
                key={sujet.id}
                className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-2">
                  <h2 className="font-semibold text-neutral-800">{sujet.titre}</h2>
                  {infoScore?.score != null && (
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-2 ${couleurBadge(
                        infoScore.score
                      )}`}
                    >
                      {infoScore.score}% pertinent
                    </span>
                  )}
                </div>

                <p className="text-neutral-500 text-sm mb-2">{sujet.description}</p>

                {infoScore?.justification && (
                  <div className="flex items-start gap-1.5 bg-primary/5 rounded-lg px-3 py-2 mb-4">
                    <Sparkles size={14} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-primary-dark italic">
                      {infoScore.justification}
                    </p>
                  </div>
                )}

                <div className={`flex items-center gap-2 text-sm text-neutral-600 mb-4 ${!infoScore?.justification ? "mt-2" : ""}`}>
                  <User size={16} className="text-primary" />
                  {sujet.encadrant?.prenom} {sujet.encadrant?.nom}
                </div>

                <button
                  onClick={() => handlePostuler(sujet.id)}
                  disabled={
                    sujet.statut === "verrouille" ||
                    postulationEnCours === sujet.id ||
                    !peutPostuler
                  }
                  className="w-full bg-primary hover:bg-primary-dark text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                >
                  {sujet.statut === "verrouille"
                    ? "Sujet pourvu"
                    : postulationEnCours === sujet.id
                    ? "Envoi..."
                    : "Postuler"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}