import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ClipboardCheck, FileText, ClipboardList } from "lucide-react";
import Navbar from "../../components/common/Navbar";
import StatCard from "../../components/common/StatCard";
import ActionCard from "../../components/common/ActionCard";
import api from "../../services/api";

export default function EncadrantDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({ nbStagiaires: 0, candidaturesEnAttente: 0 });
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    api.get('/encadrant/dashboard-stats')
      .then((res) => setStats(res.data))
      .catch(() => setErreur("Impossible de charger les statistiques."))
      .finally(() => setChargement(false));
  }, []);

  return (
    <>
      <Navbar role="Encadrant" />
      <div className="min-h-screen bg-neutral-100 p-6">
        <h1 className="text-3xl font-bold text-primary-dark mb-6">Vue d'ensemble</h1>

        <p className="text-sm font-semibold text-neutral-500 tracking-wide mb-3">STATISTIQUES</p>
        {erreur && <p className="text-red-600 text-sm mb-3">{erreur}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <StatCard
            label="Mes stagiaires"
            value={chargement ? '...' : stats.nbStagiaires}
            Icon={Users}
            color="primary"
            to="/encadrant/stagiaires"
          />
          <StatCard
            label="Candidatures en attente"
            value={chargement ? '...' : stats.candidaturesEnAttente}
            Icon={ClipboardCheck}
            color="accent"
            to="/encadrant/candidatures"
          />
        </div>

        <p className="text-sm font-semibold text-neutral-500 tracking-wide mb-3">ACTIONS</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ActionCard
            Icon={ClipboardCheck}
            label="Candidatures"
            onClick={() => navigate("/encadrant/candidatures")}
          />
          <ActionCard
            Icon={FileText}
            label="Documents des stagiaires"
            onClick={() => navigate("/encadrant/documents")}
          />
          <ActionCard
            Icon={ClipboardList}
            label="Suivi hebdomadaire"
            onClick={() => navigate("/encadrant/suivi-hebdo")}
          />
        </div>
      </div>
    </>
  );
}