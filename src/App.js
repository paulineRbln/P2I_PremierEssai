import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Importer React Router
import './App.css';
import PageAccueil from './Pages/PageAccueil'; // Page d'accueil
import Events from './Pages/Events'; // Votre composant Profil
import Calendrier from './Pages/Calendrier'; // Votre composant Profil
import Maison from './Pages/Maison'; // Votre composant Profil
import Menu from './GrosElements/Menu'; // Menu de navigation
import Connexion from './Pages/Connexion'; // Composant de connexion

function App() {
  const [auth, setAuth] = useState(localStorage.getItem("token") !== null); // Gérer l'état d'authentification

  // Mettre à jour l'état d'authentification lorsque le token change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuth(token !== null); // Si un token est présent, l'utilisateur est authentifié
  }, []); // Lancer à l'initialisation

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route pour la page de connexion */}
          <Route path="/connexion" element={<Connexion />} />

          {/* Routes protégées : si l'utilisateur n'est pas authentifié, redirection vers /connexion */}
          <Route path="/" element={auth ? <PageAccueil setAuth={setAuth}/> : <Navigate to="/connexion" />} />
          <Route path="/calendrier" element={auth ? <Calendrier /> : <Navigate to="/connexion" />} />
          <Route path="/events" element={auth ? <Events /> : <Navigate to="/connexion" />} />
          <Route path="/maison" element={auth ? <Maison /> : <Navigate to="/connexion" />} />
        </Routes>

        {/* Le menu de navigation, visible sur toutes les pages après la connexion */}
        {auth && <Menu  />}
      </div>
    </Router>
  );
}

export default App;
