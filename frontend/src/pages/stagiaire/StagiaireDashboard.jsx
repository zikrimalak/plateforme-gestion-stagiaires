import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  BookOpen,
  ClipboardList,
  FileUp,
  MessageSquare,
  CalendarDays,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import ActionCard from "../../components/common/ActionCard";
import api from "../../services/api";

export default function StagiaireDashboard() {
  const navigate = useNavigate();

  const [sujetAffecte, setSujetAffecte] = useState(null);
  const [remarques, setRemarques] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreurDates, setErreurDates] = useState(null);

  const chargerDonnees = () => {
    api.get('/stagiaire/dashboard-data')
      .then((res) => {
        setSujetAffecte(res.data.sujetAffecte);
        setRemarques(res.data.remarques);
      })
      .catch(() => setErreur("Impossible de charger vos informations."))
      .finally(() => setChargement(false));
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  const enregistrerDates = (e) => {
    e.preventDefault();
    setErreurDates(null);
    setEnvoiEnCours(true);

    api.patch('/mon-stage/dates', { date_debut: dateDebut, date_fin: dateFin })
      .then(() => chargerDonnees())
      .catch((err) => {
        setErreurDates(
          err.response?.data?.message || "Erreur lors de l'enregistrement des dates."
        );
      })
      .finally(() => setEnvoiEnCours(false));
  };

  // Convertit une date ISO ("2026-08-04T00:00:00.000000Z") en format français ("04/08/2026")
  const formaterDate = (dateIso) => {
    if (!dateIso) return "";
    return new Date(dateIso).toLocaleDateString("fr-FR");
  };

  return (
    <>
      <Navbar role="Stagiaire" />
      <div className="min-h-screen bg-neutral-100 p-6">
        <h1 className="text-3xl font-bold text-primary-dark mb-6">Vue d'ensemble</h1>

        {erreur && <p className="text-red-600 text-sm mb-4">{erreur}</p>}

        {!chargement && (
          sujetAffecte ? (
            <div className="bg-yellow-50 border border-accent-dark/30 rounded-2xl p-5 mb-8 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-accent w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="text-primary-dark" size={22} />
                </div>
                <div>
                  <p className="font-semibold text-neutral-800">
                    Votre candidature a été acceptée !
                  </p>
                  <p className="text-neutral-600 text-sm mt-1">
                    Sujet : <span className="font-medium">{sujetAffecte.titre}</span>
                  </p>
                  <p className="text-neutral-600 text-sm">
                    Encadrant : <span className="font-medium">{sujetAffecte.encadrant.nom}</span>
                  </p>
                  <p className="text-neutral-600 text-sm">
                    Email : <span className="font-medium">{sujetAffecte.encadrant.email}</span>
                  </p>
                  <p className="text-neutral-600 text-sm">
                    Telephone : <span className="font-medium">{sujetAffecte.encadrant.telephone}</span>
                  </p>
                </div>
              </div>

              {/* Dates du stage */}
              {sujetAffecte.dateDebut && sujetAffecte.dateFin ? (
                <div className="flex items-center gap-2 text-sm text-neutral-700 border-t border-accent-dark/20 pt-3">
                  <CalendarDays size={16} className="text-primary-dark" />
                  Stage du <span className="font-medium">{formaterDate(sujetAffecte.dateDebut)}</span> au{" "}
                  <span className="font-medium">{formaterDate(sujetAffecte.dateFin)}</span>
                </div>
              ) : (
                <form
                  onSubmit={enregistrerDates}
                  className="border-t border-accent-dark/20 pt-4 flex flex-col sm:flex-row items-end gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-neutral-500">Date de début</label>
                    <input
                      type="date"
                      value={dateDebut}
                      onChange={(e) => setDateDebut(e.target.value)}
                      required
                      className="border border-neutral-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-neutral-500">Date de fin</label>
                    <input
                      type="date"
                      value={dateFin}
                      onChange={(e) => setDateFin(e.target.value)}
                      required
                      className="border border-neutral-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={envoiEnCours}
                    className="bg-primary text-white text-sm px-4 py-1.5 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                  >
                    {envoiEnCours ? "Enregistrement..." : "Confirmer les dates"}
                  </button>
                  {erreurDates && (
                    <p className="text-red-600 text-xs sm:ml-2">{erreurDates}</p>
                  )}
                </form>
              )}
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 mb-8">
              <p className="text-neutral-500">
                Aucun sujet ne vous a encore été affecté. Consultez les sujets disponibles ci-dessous.
              </p>
            </div>
          )
        )}

        <p className="text-sm font-semibold text-neutral-500 tracking-wide mb-3">ACTIONS</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <ActionCard
            Icon={BookOpen}
            label="Sujets disponibles"
            onClick={() => navigate("/stagiaire/sujets")}
          />
          <ActionCard
            Icon={ClipboardList}
            label="Suivi hebdomadaire"
            onClick={() => navigate("/stagiaire/suivihebdo")}
          />
          <ActionCard
            Icon={FileUp}
            label="Déposer un document"
            onClick={() => navigate("/stagiaire/depot-document")}
          />
        </div>

        <p className="text-sm font-semibold text-neutral-500 tracking-wide mb-3">
          REMARQUES DE VOTRE ENCADRANT
        </p>
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-neutral-100">
          {remarques.length > 0 ? (
            remarques.map((r) => (
              <div key={r.id} className="p-4 flex gap-3">
                <MessageSquare className="text-primary shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-neutral-700 text-sm">{r.texte}</p>
                  <p className="text-neutral-400 text-xs mt-1">{r.created_at}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-neutral-400 text-sm">Aucune remarque pour le moment.</p>
          )}
        </div>
      </div>
    </>
  );
}