import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import Navbar from "../../components/common/Navbar";
import AgentIAChat from "../../components/agent-ia/AgentIAChat";

// TODO: remplacer par un vrai fetch axios une fois le backend branché
const sujetsDisponibles = [
  {
    id: 1,
    titre: "Développement d'une plateforme de gestion des stagiaires",
    description: "Conception et développement d'une application web complète pour gérer les stages, du dépôt de candidature au suivi hebdomadaire.",
    encadrant: "Anas Bodor",
  },
  {
    id: 2,
    titre: "Automatisation de la collecte de données statistiques",
    description: "Mise en place d'un pipeline automatisé pour la collecte et le traitement de données statistiques régionales.",
    encadrant: "Fatima Zahra Alaoui",
  },
  {
    id: 3,
    titre: "Tableau de bord décisionnel pour le suivi des indicateurs",
    description: "Création d'un dashboard interactif permettant de visualiser les indicateurs clés de performance du service.",
    encadrant: "Karim Benjelloun",
  },
];

export default function StagiaireSujets() {
  const navigate = useNavigate();

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sujetsDisponibles.map((sujet) => (
            <div
              key={sujet.id}
              className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 flex flex-col"
            >
              <h2 className="font-semibold text-neutral-800 mb-2">{sujet.titre}</h2>
              <p className="text-neutral-500 text-sm mb-4 flex-1">{sujet.description}</p>
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
                <User size={16} className="text-primary" />
                {sujet.encadrant}
              </div>
              <button className="w-full bg-primary hover:bg-primary-dark text-white text-sm font-medium py-2 rounded-lg transition">
                Postuler
              </button>
            </div>
          ))}
        </div>

        <AgentIAChat />
      </div>
    </>
  );
}