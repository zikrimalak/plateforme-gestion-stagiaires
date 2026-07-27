import {Routes,Route} from 'react-router-dom'
import Accueil from './pages/auth/Accueil'
import Login from './pages/auth/Login'
import DefinirMotDePasse from './pages/auth/DefinirMotDePasse'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAjouterStagiaire from './pages/admin/AdminAjouterStagiaire'
import AdminSupprimerStagiaire from './pages/admin/AdminSupprimerStagiaire'
import AdminAjouterEncadrant from './pages/admin/AdminAjouterEncadrant'
import AdminSupprimerEncadrant from './pages/admin/AdminSupprimerEncadrant'
import AdminAjouterSujet from './pages/admin/AdminAjouterSujet'
import AdminModifierSujet from './pages/admin/AdminModifierSujet'
import AdminSupprimerSujet from './pages/admin/AdminSupprimerSujet'
import StagiaireDashboard from "./pages/stagiaire/StagiaireDashboard";
import StagiaireSujets from "./pages/stagiaire/StagiaireSujets";
import StagiaireSuiviHebdo from "./pages/stagiaire/StagiaireSuiviHebdo";
import StagiaireDepotDocument from "./pages/stagiaire/StagiaireDepotDocument";
import EncadrantDashboard from "./pages/encadrant/EncadrantDashboard";
import EncadrantCandidatures from "./pages/encadrant/EncadrantCandidatures";
import EncadrantDocuments from "./pages/encadrant/EncadrantDocuments";
import EncadrantSuiviHebdo from "./pages/encadrant/EncadrantSuiviHebdo";
import './index.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/definir-mot-de-passe/:token" element={<DefinirMotDePasse />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/stagiaires/ajouter" element={<AdminAjouterStagiaire />} />
<Route path="/admin/stagiaires/supprimer" element={<AdminSupprimerStagiaire />} />
<Route path="/admin/encadrants/ajouter" element={<AdminAjouterEncadrant />} />
<Route path="/admin/encadrants/supprimer" element={<AdminSupprimerEncadrant />} />
<Route path="/admin/sujets/ajouter" element={<AdminAjouterSujet />} />
<Route path="/admin/sujets/modifier" element={<AdminModifierSujet />} />
<Route path="/admin/sujets/supprimer" element={<AdminSupprimerSujet />} />
<Route path="/stagiaire/dashboard" element={<StagiaireDashboard />} />
<Route path="/stagiaire/sujets" element={<StagiaireSujets />} />
<Route path="/stagiaire/suivihebdo" element={<StagiaireSuiviHebdo />} />
<Route path="/stagiaire/depot-document" element={<StagiaireDepotDocument />}/>
<Route path="/encadrant/dashboard" element={<EncadrantDashboard />}/>
<Route path="/encadrant/candidatures" element={<EncadrantCandidatures />} />
<Route path="/encadrant/documents" element={<EncadrantDocuments />} />
<Route path="/encadrant/suivi-hebdo" element={<EncadrantSuiviHebdo />} />
    </Routes>
  )
}

export default App