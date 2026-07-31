import {Routes,Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
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

      {/* Routes Admin */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/stagiaires/ajouter" element={
        <ProtectedRoute allowedRole="admin"><AdminAjouterStagiaire /></ProtectedRoute>
      } />
      <Route path="/admin/stagiaires/supprimer" element={
        <ProtectedRoute allowedRole="admin"><AdminSupprimerStagiaire /></ProtectedRoute>
      } />
      <Route path="/admin/encadrants/ajouter" element={
        <ProtectedRoute allowedRole="admin"><AdminAjouterEncadrant /></ProtectedRoute>
      } />
      <Route path="/admin/encadrants/supprimer" element={
        <ProtectedRoute allowedRole="admin"><AdminSupprimerEncadrant /></ProtectedRoute>
      } />
      <Route path="/admin/sujets/ajouter" element={
        <ProtectedRoute allowedRole="admin"><AdminAjouterSujet /></ProtectedRoute>
      } />
      <Route path="/admin/sujets/modifier" element={
        <ProtectedRoute allowedRole="admin"><AdminModifierSujet /></ProtectedRoute>
      } />
      <Route path="/admin/sujets/supprimer" element={
        <ProtectedRoute allowedRole="admin"><AdminSupprimerSujet /></ProtectedRoute>
      } />

      {/* Routes Stagiaire */}
      <Route path="/stagiaire/dashboard" element={
        <ProtectedRoute allowedRole="stagiaire"><StagiaireDashboard /></ProtectedRoute>
      } />
      <Route path="/stagiaire/sujets" element={
        <ProtectedRoute allowedRole="stagiaire"><StagiaireSujets /></ProtectedRoute>
      } />
      <Route path="/stagiaire/suivihebdo" element={
        <ProtectedRoute allowedRole="stagiaire"><StagiaireSuiviHebdo /></ProtectedRoute>
      } />
      <Route path="/stagiaire/depot-document" element={
        <ProtectedRoute allowedRole="stagiaire"><StagiaireDepotDocument /></ProtectedRoute>
      } />

      {/* Routes Encadrant */}
      <Route path="/encadrant/dashboard" element={
        <ProtectedRoute allowedRole="encadrant"><EncadrantDashboard /></ProtectedRoute>
      } />
      <Route path="/encadrant/candidatures" element={
        <ProtectedRoute allowedRole="encadrant"><EncadrantCandidatures /></ProtectedRoute>
      } />
      <Route path="/encadrant/documents" element={
        <ProtectedRoute allowedRole="encadrant"><EncadrantDocuments /></ProtectedRoute>
      } />
      <Route path="/encadrant/suivi-hebdo" element={
        <ProtectedRoute allowedRole="encadrant"><EncadrantSuiviHebdo /></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App