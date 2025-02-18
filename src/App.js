import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Importer React Router
import './App.css';
import PageAccueil from './Pages/PageAccueil'; // Page d'accueil
import Events from './Pages/Events'; // Votre composant Profil
import Calendrier from './Pages/Calendrier'; // Votre composant Profil
import Maison from './Pages/Maison'; // Votre composant Profil
import Menu from './GrosElements/Menu'; // Menu de navigation
import Connexion from './Pages/Connexion'; // Composant de connexion

function App() {
  // Fonction pour vérifier la présence du token dans localStorage
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token !== null; // Si un token est présent, l'utilisateur est authentifié
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route pour la page de connexion */}
          <Route path="/connexion" element={<Connexion />} />

          {/* Routes protégées : si l'utilisateur n'est pas authentifié, redirection vers /connexion */}
          <Route path="/" element={isAuthenticated() ? <PageAccueil /> : <Navigate to="/connexion" />} />
          <Route path="/calendrier" element={isAuthenticated() ? <Calendrier /> : <Navigate to="/connexion" />} />
          <Route path="/events" element={isAuthenticated() ? <Events /> : <Navigate to="/connexion" />} />
          <Route path="/maison" element={isAuthenticated() ? <Maison /> : <Navigate to="/connexion" />} />
        </Routes>
        {/* Le menu de navigation, visible sur toutes les pages après la connexion */}
        {isAuthenticated() && <Menu />}
      </div>
    </Router>
  );
}

export default App;
