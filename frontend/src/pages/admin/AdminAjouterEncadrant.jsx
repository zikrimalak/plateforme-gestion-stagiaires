import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Building2, Save } from "lucide-react";
import Navbar from "../../components/common/Navbar";

export default function AdminAjouterEncadrant() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", telephone: "", departement: "" });
  const [erreurEmail, setErreurEmail] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "email") setErreurEmail("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email.endsWith("@hcp.ma")) {
      setErreurEmail("L'email doit être une adresse professionnelle @hcp.ma");
      return;
    }

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
          <h1 className="text-2xl font-bold text-neutral-800 mb-1">Ajouter un encadrant</h1>
          <p className="text-neutral-500 mb-6">
            Un email de vérification sera envoyé pour la définition du mot de passe.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-md p-6 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  value={form.prenom}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                  required
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={form.nom}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="@hcp.ma"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    erreurEmail
                      ? "border-red-300 focus:ring-red-400"
                      : "border-neutral-200 focus:ring-primary"
                  }`}
                  required
                />
              </div>
              {erreurEmail && (
                <p className="text-red-500 text-sm mt-1">{erreurEmail}</p>
              )}
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="tel"
                name="telephone"
                placeholder="Téléphone"
                value={form.telephone}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>

            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                name="departement"
                placeholder="Département"
                value={form.departement}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg transition hover:scale-[1.02]"
            >
              <Save size={18} />
              Enregistrer l'encadrant
            </button>
          </form>
        </div>
      </div>
    </>
  );
}