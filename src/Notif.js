import React from 'react';
import RectangleAffichage from './RectangleAffichage'; // Assure-toi que ce fichier existe
import './Notif.css'; // Si tu as des styles supplémentaires

function Notif({ titre, notifications, couleur, task }) {
  return (
    <div className="notif">
      {/* Affichage du titre "URGENT" si la liste de notifications n'est pas vide */}
      {notifications.length > 0 && <h3>{titre}</h3>}
      
      {/* Affichage des notifications */}
      {notifications.map((notif, index) => (
        <RectangleAffichage
          key={index}
          textGras={notif.titre}
          textPetit={notif.message}
          couleur={couleur} // Couleur spécifique des notifications urgentes
          task={task} // Passer la prop task pour afficher la case à cocher si task est true
        />
      ))}
    </div>
  );
}

export default Notif;
