import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, FileText, Send, CheckCircle2, Clock, Download, XCircle,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import api from "../../services/api";

// Types affichés en champs dédiés en haut de page (obligatoires pour candidater)
const TYPES_DEDIES = ["CV", "Lettre de motivation"];

// Le menu déroulant générique ne propose plus CV / Lettre de motivation,
// puisqu'ils ont désormais leurs propres champs au-dessus
const TYPES_GENERIQUES = ["Convention de stage", "Rapport de stage", "Présentation", "Autre"];

function BadgeStatut({ statut }) {
  if (statut === "valide") {
    return (
      <span className="flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
        <CheckCircle2 size={14} /> Validé
      </span>
    );
  }
  if (statut === "refuse") {
    return (
      <span className="flex items-center gap-1 bg-red-50 text-red-500 text-xs font-medium px-3 py-1 rounded-full">
        <XCircle size={14} /> Refusé
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
      <Clock size={14} /> En attente
    </span>
  );
}

// Bloc dédié réutilisé pour CV et Lettre de motivation.
// `document` est le document déjà déposé pour ce type (ou undefined si aucun).
function ChampDocumentDedie({ type, document, onDepose }) {
  const [fichier, setFichier] = useState(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fichier) return;

    setEnvoiEnCours(true);
    setErreur("");

    const donnees = new FormData();
    donnees.append("type", type);
    donnees.append("fichier", fichier);

    try {
      const res = await api.post("/documents", donnees, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onDepose(res.data);
      setFichier(null);
      e.target.reset();
    } catch (err) {
      setErreur("Le dépôt a échoué. Vérifie le type de fichier et sa taille (5 Mo max).");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
          <FileText size={18} className="text-primary" />
          {type}
        </h3>
        {document && <BadgeStatut statut={document.statut} />}
      </div>

      {document && (
        <p className="text-sm text-neutral-500 mb-3">
          Fichier actuel : {document.nom_fichier}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="file"
          onChange={(e) => setFichier(e.target.files[0])}
          accept=".pdf,.doc,.docx"
          className="flex-1 border border-neutral-200 rounded-lg p-2 text-sm"
          required
        />
        <button
          type="submit"
          disabled={envoiEnCours}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-60 shrink-0"
        >
          <Send size={16} />
          {envoiEnCours ? "Envoi..." : document ? "Remplacer" : "Déposer"}
        </button>
      </form>

      {erreur && <p className="text-red-600 text-xs mt-2">{erreur}</p>}
    </div>
  );
}

export default function StagiaireDepotDocument() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const [form, setForm] = useState({ type: "", fichier: null });

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

  // Trouve le document le plus récent d'un type donné (utilisé pour CV / Lettre de motivation)
  const trouverDocument = (type) => documents.find((doc) => doc.type === type);

  // Appelé quand un des champs dédiés (CV ou Lettre) vient de déposer un fichier :
  // on retire l'ancien document de ce type (s'il existait) et on ajoute le nouveau
  const handleDeposeDedie = (nouveauDocument) => {
    setDocuments((prev) => [
      nouveauDocument,
      ...prev.filter((doc) => doc.type !== nouveauDocument.type),
    ]);
  };

  const handleTypeChange = (e) => setForm({ ...form, type: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, fichier: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fichier || !form.type) return;

    setEnvoiEnCours(true);
    setErreur("");

    const donnees = new FormData();
    donnees.append("type", form.type);
    donnees.append("fichier", form.fichier);

    try {
      const res = await api.post("/documents", donnees, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

        {!chargement && (
          <>
            <p className="text-sm font-semibold text-neutral-500 tracking-wide mb-3">
              DOCUMENTS REQUIS POUR POSTULER
            </p>
            <div className="space-y-4 mb-8">
              {TYPES_DEDIES.map((type) => (
                <ChampDocumentDedie
                  key={type}
                  type={type}
                  document={trouverDocument(type)}
                  onDepose={handleDeposeDedie}
                />
              ))}
            </div>
          </>
        )}

        <p className="text-sm font-semibold text-neutral-500 tracking-wide mb-3">AUTRES DOCUMENTS</p>

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
              {TYPES_GENERIQUES.map((type) => (
                <option key={type}>{type}</option>
              ))}
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
            {documents
              .filter((doc) => !TYPES_DEDIES.includes(doc.type))
              .map((doc) => (
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
                    <BadgeStatut statut={doc.statut} />
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