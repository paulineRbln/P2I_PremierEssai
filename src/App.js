import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importer React Router
import './App.css'; 
import PageAccueil from './Pages/PageAccueil'; // Page d'accueil
import Events from './Pages/Events'; // Votre composant Profil
import Calendrier from './Pages/Calendrier'; // Votre composant Profil
import Maison from './Pages/Maison'; // Votre composant Profil
import Menu from './GrosElements/Menu'; // Menu de navigation

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PageAccueil />} /> {/* Page d'accueil */}
          <Route path="/calendrier" element={<Calendrier />} /> 
          <Route path="/events" element={<Events />} /> 
          <Route path="/maison" element={<Maison />} /> 
        </Routes>
        <Menu />
      </div>
    </Router>
  );
}

export default App;
