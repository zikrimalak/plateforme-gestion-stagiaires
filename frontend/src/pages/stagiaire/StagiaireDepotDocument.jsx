import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  Download,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";

// TODO : remplacer par les données du backend
const documentsInitiaux = [
  {
    id: 1,
    type: "CV",
    nom: "CV_Malak.pdf",
    date: "22 juillet 2026",
    statut: "valide",
  },
  {
    id: 2,
    type: "Convention de stage",
    nom: "Convention.pdf",
    date: "25 juillet 2026",
    statut: "en_attente",
  },
];

export default function StagiaireDepotDocument() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState(documentsInitiaux);

  const [form, setForm] = useState({
    type: "",
    fichier: null,
  });

  const handleTypeChange = (e) => {
    setForm({
      ...form,
      type: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      fichier: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.fichier || !form.type) return;

    // TODO : axios POST vers le backend

    const nouveauDocument = {
      id: documents.length + 1,
      type: form.type,
      nom: form.fichier.name,
      date: "Aujourd'hui",
      statut: "en_attente",
    };

    setDocuments([nouveauDocument, ...documents]);

    setForm({
      type: "",
      fichier: null,
    });

    e.target.reset();
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

        <h1 className="text-2xl font-bold text-neutral-800 mb-1">
          Déposer un document
        </h1>

        <p className="text-neutral-500 mb-6">
          Dépose les documents demandés pour ton stage.
        </p>

        {/* Formulaire */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-6 space-y-5 mb-8"
        >
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
              className="w-full border border-neutral-200 rounded-lg p-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg transition hover:scale-[1.02]"
          >
            <Send size={18} />
            Déposer le document
          </button>
        </form>

        {/* Historique */}

        <p className="text-sm font-semibold text-neutral-500 tracking-wide mb-3">
          DOCUMENTS DÉPOSÉS
        </p>

        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5"
            >
              <div className="flex justify-between items-center mb-3">

                <div>
                  <h3 className="font-semibold text-neutral-800">
                    {doc.type}
                  </h3>

                  <p className="text-sm text-neutral-500">
                    {doc.nom}
                  </p>

                  <p className="text-xs text-neutral-400 mt-1">
                    Déposé le {doc.date}
                  </p>
                </div>

                {doc.statut === "valide" ? (
                  <span className="flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
                    <CheckCircle2 size={14} />
                    Validé
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
                    <Clock size={14} />
                    En attente
                  </span>
                )}
              </div>

              <button className="flex items-center gap-2 text-primary hover:text-primary-dark text-sm">
                <Download size={16} />
                Télécharger le document
              </button>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}