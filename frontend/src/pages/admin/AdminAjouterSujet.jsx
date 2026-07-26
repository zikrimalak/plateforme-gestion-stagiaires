import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, AlignLeft, User, Save } from "lucide-react";
import Navbar from "../../components/common/Navbar";

// TODO: remplacer par un vrai fetch axios une fois le backend branché
const encadrantsDisponibles = [
  { id: 1, nom: "Anas Bodor" },
  { id: 2, nom: "Fatima Zahra Alaoui" },
  { id: 3, nom: "Karim Benjelloun" },
];

export default function AdminAjouterSujet() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ titre: "", description: "", encadrantId: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: appel axios vers le backend
    console.log(form);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-100 p-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-primary hover:text-primary-dark transition mb-6"
        >
          <ArrowLeft size={18} />
          Retour au tableau de bord
        </button>

        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold text-neutral-800 mb-1">Ajouter un sujet</h1>
          <p className="text-neutral-500 mb-6">
            Le sujet sera visible par les stagiaires dès sa création.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-md p-6 space-y-4"
          >
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                name="titre"
                placeholder="Titre du sujet"
                value={form.titre}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
              />
            </div>

            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 text-neutral-400" size={18} />
              <textarea
                name="description"
                placeholder="Petite description du sujet"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                required
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
              <select
                name="encadrantId"
                value={form.encadrantId}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition appearance-none bg-white"
                required
              >
                <option value="" disabled>
                  Affecter à un encadrant
                </option>
                {encadrantsDisponibles.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nom}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg transition hover:scale-[1.02]"
            >
              <Save size={18} />
              Enregistrer le sujet
            </button>
          </form>
        </div>
      </div>
    </>
  );
}