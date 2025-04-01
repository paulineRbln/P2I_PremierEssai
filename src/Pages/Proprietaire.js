// PageAccueil.js
import React, { useState, useEffect } from 'react';
import { Notif, NotifNews } from '../GrosElements/Notif';
import './Proprietaire.css'; // Importer le fichier CSS
import { lienAPIMachine } from '../LienAPI/lienAPI'; // Importer la fonction lienAPIMachine

function Proprietaire() {
  

  return (
    <div className="page-accueil" style={{ backgroundColor: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <h1>Page Proprietaire</h1>
    </div>
  );
}

export default Proprietaire;
