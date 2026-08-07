import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, AlertTriangle } from "lucide-react";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

const TYPES_REQUIS = ["CV", "Lettre de motivation"];

export default function StagiaireSujets() {
  const navigate = useNavigate();
  const [sujets, setSujets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");
  const [postulationEnCours, setPostulationEnCours] = useState(null);
  const [messagePostulation, setMessagePostulation] = useState("");
  const [typesManquants, setTypesManquants] = useState([]);

  useEffect(() => {
    // On charge les sujets ET les documents déjà déposés en parallèle
    Promise.all([api.get("/sujets"), api.get("/mes-documents")])
      .then(([resSujets, resDocuments]) => {
        setSujets(resSujets.data);

        const typesDeposes = new Set(resDocuments.data.map((doc) => doc.type));
        const manquants = TYPES_REQUIS.filter((type) => !typesDeposes.has(type));
        setTypesManquants(manquants);
      })
      .catch(() => setErreur("Impossible de charger les sujets."))
      .finally(() => setLoading(false));
  }, []);

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

        {loading && <p className="text-neutral-500 text-sm">Chargement des sujets...</p>}
        {erreur && <p className="text-red-600 text-sm">{erreur}</p>}
        {messagePostulation && <p className="text-sm text-primary mb-4">{messagePostulation}</p>}
        {!loading && !erreur && sujets.length === 0 && (
          <p className="text-neutral-500 text-sm">Aucun sujet disponible pour le moment.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sujets.map((sujet) => (
            <div
              key={sujet.id}
              className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 flex flex-col"
            >
              <h2 className="font-semibold text-neutral-800 mb-2">{sujet.titre}</h2>
              <p className="text-neutral-500 text-sm mb-4 flex-1">{sujet.description}</p>
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
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
                className="w-full bg-primary hover:bg-primary-dark text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sujet.statut === "verrouille"
                  ? "Sujet pourvu"
                  : postulationEnCours === sujet.id
                  ? "Envoi..."
                  : "Postuler"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}