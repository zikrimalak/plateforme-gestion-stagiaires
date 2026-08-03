import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, FileText, Send, CheckCircle2, Clock, Download, XCircle,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

export default function StagiaireDepotDocument() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const [form, setForm] = useState({ type: "", fichier: null });

  // Charge l'historique depuis le backend au montage de la page
  useEffect(() => {
    const charger = async () => {
      try {
        const res = await api.get("/mes-documents");
        setDocuments(res.data);
      } catch (err) {
        setErreur("Impossible de charger tes documents.");
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const handleTypeChange = (e) => setForm({ ...form, type: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, fichier: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fichier || !form.type) return;

    setEnvoiEnCours(true);
    setErreur("");

    // Ici, contrairement à un objet JS classique, on construit un FormData :
    // c'est le seul format que le navigateur sait utiliser pour envoyer un fichier
    // en plus de champs texte, dans une requête multipart/form-data.
    const donnees = new FormData();
    donnees.append("type", form.type);
    donnees.append("fichier", form.fichier);

    try {
      const res = await api.post("/documents", donnees, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // on ajoute le document renvoyé par le backend en tête de liste
      setDocuments([res.data, ...documents]);
      setForm({ type: "", fichier: null });
      e.target.reset();
    } catch (err) {
      setErreur("Le dépôt du document a échoué. Vérifie le type de fichier et sa taille (5 Mo max).");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <>
      <Navbar role="Stagiaire" />
      <div className="min-h-screen bg-neutral-100 p-6">
        <button
          onClick={() => navigate("/stagiaire/dashboard")}
          className="flex items-center gap-2 text-primary hover:text-primary-dark transition mb-6"
        >
          <ArrowLeft size={18} />
          Retour au tableau de bord
        </button>

        <h1 className="text-2xl font-bold text-neutral-800 mb-1">Déposer un document</h1>
        <p className="text-neutral-500 mb-6">Dépose les documents demandés pour ton stage.</p>

        {erreur && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-5 mb-8">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
              <FileText size={18} className="text-primary" />
              Type de document
            </label>
            <select
              value={form.type}
              onChange={handleTypeChange}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Choisir un document</option>
              <option>CV</option>
              <option>Lettre de motivation</option>
              <option>Convention de stage</option>
              <option>Rapport de stage</option>
              <option>Présentation</option>
              <option>Autre</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
              <Upload size={18} className="text-primary" />
              Sélectionner un fichier
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="w-full border border-neutral-200 rounded-lg p-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={envoiEnCours}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg transition hover:scale-[1.02] disabled:opacity-60"
          >
            <Send size={18} />
            {envoiEnCours ? "Envoi en cours..." : "Déposer le document"}
          </button>
        </form>

        <p className="text-sm font-semibold text-neutral-500 tracking-wide mb-3">DOCUMENTS DÉPOSÉS</p>

        {chargement ? (
          <p className="text-neutral-400 text-sm">Chargement...</p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-semibold text-neutral-800">{doc.type}</h3>
                    <p className="text-sm text-neutral-500">{doc.nom_fichier}</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Déposé le {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                    </p>
                    {doc.commentaire && (
                      <p className="text-xs text-neutral-500 italic mt-1">"{doc.commentaire}"</p>
                    )}
                  </div>

                  {doc.statut === "valide" && (
                    <span className="flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
                      <CheckCircle2 size={14} /> Validé
                    </span>
                  )}
                  {doc.statut === "refuse" && (
                    <span className="flex items-center gap-1 bg-red-50 text-red-500 text-xs font-medium px-3 py-1 rounded-full">
                      <XCircle size={14} /> Refusé
                    </span>
                  )}
                  {doc.statut === "en_attente" && (
                    <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
                      <Clock size={14} /> En attente
                    </span>
                  )}
                </div>

                
                 <a href={`${api.defaults.baseURL}/documents/${doc.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary-dark text-sm w-fit"
                >
                  <Download size={16} />
                  Télécharger le document
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}