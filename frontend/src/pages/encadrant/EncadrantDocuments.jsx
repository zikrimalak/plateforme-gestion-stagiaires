import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, FileText, Download, CheckCircle2, XCircle, Clock, MessageSquare,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

export default function EncadrantDocuments() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [commentaireOuvert, setCommentaireOuvert] = useState(null);
  const [brouillon, setBrouillon] = useState("");

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await api.get("/encadrant/documents");
        setDocuments(res.data);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const majDocument = async (id, champs) => {
    // PATCH : on n'envoie que ce qui change (statut et/ou commentaire),
    // le backend fait le update() partiel et nous renvoie le document à jour
    const res = await api.patch(`/encadrant/documents/${id}`, champs);
    setDocuments((prev) => prev.map((d) => (d.id === id ? res.data : d)));
  };

  const valider = (id) => majDocument(id, { statut: "valide" });
  const refuser = (id) => majDocument(id, { statut: "refuse" });

  const ouvrirCommentaire = (doc) => {
    setCommentaireOuvert(doc.id);
    setBrouillon(doc.commentaire || "");
  };

  const enregistrerCommentaire = async (id) => {
    await majDocument(id, { commentaire: brouillon });
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

        <h1 className="text-2xl font-bold text-neutral-800 mb-1">Documents des stagiaires</h1>
        <p className="text-neutral-500 mb-6">
          Consulte, valide et commente les documents déposés par tes stagiaires.
        </p>

        {chargement ? (
          <p className="text-neutral-400 text-sm">Chargement...</p>
        ) : documents.length === 0 ? (
          <p className="text-neutral-400 text-sm">Aucun document déposé pour l'instant.</p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User size={16} className="text-primary" />
                      <span className="font-semibold text-neutral-800">
                        {doc.stagiaire?.prenom} {doc.stagiaire?.nom}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <FileText size={14} className="text-primary" />
                      {doc.type} — {doc.nom_fichier}
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Déposé le {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  {doc.statut === "valide" && (
                    <span className="flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-3 py-1.5 rounded-full shrink-0 self-start">
                      <CheckCircle2 size={14} /> Validé
                    </span>
                  )}
                  {doc.statut === "refuse" && (
                    <span className="flex items-center gap-1 bg-red-50 text-red-500 text-xs font-medium px-3 py-1.5 rounded-full shrink-0 self-start">
                      <XCircle size={14} /> Refusé
                    </span>
                  )}
                  {doc.statut === "en_attente" && (
                    <span className="flex items-center gap-1 bg-yellow-50 text-accent-dark text-xs font-medium px-3 py-1.5 rounded-full shrink-0 self-start">
                      <Clock size={14} /> En attente
                    </span>
                  )}
                </div>

                {doc.commentaire && commentaireOuvert !== doc.id && (
                  <div className="bg-neutral-50 rounded-lg px-3 py-2 mb-3 flex items-start gap-2">
                    <MessageSquare size={14} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-neutral-600">{doc.commentaire}</p>
                  </div>
                )}

                {commentaireOuvert === doc.id && (
                  <div className="mb-3">
                    <textarea
                      value={brouillon}
                      onChange={(e) => setBrouillon(e.target.value)}
                      rows={2}
                      placeholder="Laisser un commentaire pour le stagiaire..."
                      className="w-full text-sm px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition resize-none mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => enregistrerCommentaire(doc.id)}
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
                  
                   <a href={`${api.defaults.baseURL}/documents/${doc.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-primary hover:text-primary-dark text-sm"
                  >
                    <Download size={16} /> Télécharger
                  </a>

                  {doc.statut === "en_attente" && (
                    <>
                      <button onClick={() => valider(doc.id)} className="flex items-center gap-1.5 text-green-600 hover:text-green-700 text-sm">
                        <CheckCircle2 size={16} /> Valider
                      </button>
                      <button onClick={() => refuser(doc.id)} className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm">
                        <XCircle size={16} /> Refuser
                      </button>
                    </>
                  )}

                  {commentaireOuvert !== doc.id && (
                    <button onClick={() => ouvrirCommentaire(doc)} className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-700 text-sm">
                      <MessageSquare size={16} />
                      {doc.commentaire ? "Modifier le commentaire" : "Commenter"}
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