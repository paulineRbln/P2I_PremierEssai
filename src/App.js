import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importer React Router
import './App.css'; 
import PageAccueil from './PageAccueil'; // Page d'accueil
import Profil from './Profil'; // Votre composant Profil
import Menu from './Menu'; // Menu de navigation

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PageAccueil />} /> {/* Page d'accueil */}
          <Route path="/profil" element={<Profil />} /> {/* Page Profil */}
        </Routes>
        <Menu />
      </div>
    </Router>
  );
}

export default App;
