import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import './App.css';
import PageAccueil from './Pages/PageAccueil'; // Page d'accueil
import Events from './Pages/Events'; // Page des événements
import Calendrier from './Pages/Calendrier'; // Page Calendrier
import Maison from './Pages/Maison'; // Page de la maison
import Menu from './GrosElements/Menu'; // Menu de navigation
import Profil from './Pages/Profil'; // Page de profil utilisateur
import InfosEvent from './Pages/InfosEvent'; // Informations détaillées d'un événement
import { Proprietaire } from './Pages/Proprietaire'; // Page réservée au propriétaire
import { Connexion, Inscription } from './Pages/Connexion'; // Pages de connexion et d'inscription

function App() {
  const token = localStorage.getItem("token"); // Récupérer le jeton d'authentification en local
  const estProprio = localStorage.getItem("estProprio") === "true"; // Vérifier si l'utilisateur est propriétaire

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route pour la page de connexion */}
          <Route path="/connexion" element={!token ? (<Connexion />) : !estProprio ? (<Navigate to="/" />) : (<Navigate to="/proprietaire" />)} />
          <Route path="/inscription" element={!token ? (<Inscription />) : !estProprio ? (<Navigate to="/" />) : (<Navigate to="/proprietaire" />)} />

          {/* Routes protégées : redirection vers /connexion si l'utilisateur n'est pas authentifié */}
          <Route path="/" element={token && !estProprio ? <PageAccueil /> : <Navigate to="/connexion" />} />
          <Route path="/calendrier" element={token && !estProprio ? <Calendrier /> : <Navigate to="/connexion" />} />
          <Route path="/events" element={token && !estProprio ? <Events /> : <Navigate to="/connexion" />} />
          <Route path="/maison" element={token && !estProprio ? <Maison /> : <Navigate to="/connexion" />} />
          <Route path="/profil" element={token ? <Profil /> : <Navigate to="/connexion" />} />
          <Route path="/infosEvent/:eventId" element={token && !estProprio ? <InfosEvent /> : <Navigate to="/connexion" />} />

          {/* Page réservée aux propriétaires */}
          <Route path="/proprietaire" element={token && estProprio ? <Proprietaire /> : <Navigate to="/connexion" />} />

          {/* Rediriger vers la page d'accueil ou la page propriétaire si la route n'existe pas */}
          <Route path="*" element={!estProprio ? (<Navigate to="/" />) : (<Navigate to="/proprietaire" />)} />
        </Routes>

        {/* Le menu de navigation, visible après la connexion */}
        {token && <Menu />} {/* Affichage du menu uniquement si l'utilisateur est connecté */}
      </div>
    </Router>
  );
}

export default App;
