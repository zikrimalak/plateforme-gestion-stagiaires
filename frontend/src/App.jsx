import {Routes,Route} from 'react-router-dom'
import Accueil from './pages/auth/Accueil'
import Login from './pages/auth/Login'
import DefinirMotDePasse from './pages/auth/DefinirMotDePasse'
import './index.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/definir-mot-de-passe/:token" element={<DefinirMotDePasse />} />
    </Routes>
  )
}

export default App