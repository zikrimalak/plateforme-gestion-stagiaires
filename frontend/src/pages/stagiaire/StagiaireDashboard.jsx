import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  BookOpen,
  ClipboardList,
  FileUp,
  MessageSquare,
  User,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import ActionCard from "../../components/common/ActionCard";

// TODO: remplacer par un vrai fetch axios une fois le backend branché
const sujetAffecte = {
  titre: "Développement d'une plateforme de gestion des stagiaires",
  encadrant:{ nom: "Anas Bodor", email: "anas.bodor@hcp.ma", telephone: "0661 23 45 67" },
};
// Pour tester le cas "pas encore affecté", mets sujetAffecte à null

// TODO: remplacer par un vrai fetch axios une fois le backend branché
const remarques = [
  {
    id: 1,
    date: "22 juillet 2026",
    texte: "Bon avancement sur la partie frontend, pense à documenter le code.",
  },
  {
    id: 2,
    date: "15 juillet 2026",
    texte: "Merci de préciser les difficultés rencontrées dans le suivi hebdomadaire.",
  },
];

export default function StagiaireDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar role="Stagiaire" />
      <div className="min-h-screen bg-neutral-100 p-6">
        <h1 className="text-3xl font-bold text-primary-dark mb-6">Vue d'ensemble</h1>

        {/* Bandeau sujet affecté */}
        {sujetAffecte ? (
          <div className="bg-yellow-50 border border-accent-dark/30 rounded-2xl p-5 mb-8 flex items-start gap-4">
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
        ) : (
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 mb-8">
            <p className="text-neutral-500">
              Aucun sujet ne vous a encore été affecté. Consultez les sujets disponibles ci-dessous.
            </p>
          </div>
        )}

        {/* Actions */}
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

        {/* Remarques de l'encadrant */}
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
                  <p className="text-neutral-400 text-xs mt-1">{r.date}</p>
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