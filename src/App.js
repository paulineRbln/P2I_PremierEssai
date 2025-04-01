import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Importer React Router
import './App.css';
import PageAccueil from './Pages/PageAccueil'; // Page d'accueil
import Events from './Pages/Events'; // Votre composant Profil
import Calendrier from './Pages/Calendrier'; // Votre composant Profil
import Maison from './Pages/Maison'; // Votre composant Profil
import Menu from './GrosElements/Menu'; // Menu de navigation
import Profil from './Pages/Profil';
import InfosEvent from './Pages/InfosEvent';
import Proprietaire from './Pages/Proprietaire';
import { Connexion, Inscription } from './Pages/Connexion'; // Composant de connexion

function App() {
  const token = localStorage.getItem("token");
  const estProprio = localStorage.getItem("estProprio") === "true"; // Vérifier si l'utilisateur est propriétaire

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route pour la page de connexion */}
          <Route path="/connexion" element={!token ? <Connexion /> : <Navigate to="/" />} />
          <Route path="/inscription" element={!token ? <Inscription /> : <Navigate to="/" />} />

          {/* Routes protégées : si l'utilisateur n'est pas authentifié, redirection vers /connexion */}
          <Route path="/" element={token && !estProprio ? <PageAccueil /> : <Navigate to="/proprio" />} />
          <Route path="/calendrier" element={token && !estProprio ? <Calendrier /> : <Navigate to="/proprio" />} />
          <Route path="/events" element={token && !estProprio ? <Events /> : <Navigate to="/proprio" />} />
          <Route path="/maison" element={token && !estProprio ? <Maison /> : <Navigate to="/proprio" />} />
          <Route path="/profil" element={token && !estProprio ? <Profil /> : <Navigate to="/proprio" />} />
          <Route path="/infosEvent/:eventId" element={token && !estProprio ? <InfosEvent /> : <Navigate to="/proprio" />} />

          {/* Page réservée aux propriétaires */}
          <Route path="/proprio" element={token && estProprio ? <Proprietaire /> : <Navigate to="/" />} />
          
          {/* Rediriger vers la page d'accueil si la route n'existe pas */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Le menu de navigation, visible sur toutes les pages après la connexion */}
        {token && !estProprio && <Menu />}
      </div>
    </Router>
  );
}

export default App;
