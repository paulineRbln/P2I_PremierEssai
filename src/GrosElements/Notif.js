import React from 'react';
import RectangleAffichage from '../PetitsElements/RectangleAffichage'; // Assure-toi que ce fichier existe
import './Notif.css'; // Si tu as des styles supplémentaires

export function Notif({ titre, notifications, couleur, task }) {
  // Vérifier si la liste notifications est null ou vide
  if (notifications === null || notifications.length === 0) {
    return (
      <div className="notif">
        <h3>{titre}</h3>
        <p>Aucune notification disponible.</p>
      </div>
    );
  }

  return (
    <div className="notif">
      <h3>{titre}</h3>

      {notifications.map((notif, index) => (
        <RectangleAffichage
          key={index}
          textGras={notif.nom}
          textPetit={notif.description}
          couleur={couleur} // Couleur spécifique des notifications urgentes
          task={task} // Passer la prop task pour afficher la case à cocher si task est true
          date={notif.date}
        />
      ))}
    </div>
  );
}

export function NotifNews({ titre, notifications, couleur }) {
  // Vérifier si la liste notifications est null ou vide
  if (notifications === null || notifications.length === 0) {
    return (
      <div className="notif">
        <h3>{titre}</h3>
        <p>Aucune news disponible.</p>
      </div>
    );
  }

  return (
    <div className="notif">
      <h3>{titre}</h3>
      {notifications.map((notif, index) => (
        <RectangleAffichage
          key={index}
          textGras={notif.titre}  // Utilisation du titre du DTO
          textPetit={notif.description}  // Utilisation de la description du DTO
          couleur={couleur}  // Passer la couleur
        />
      ))}
    </div>
  );
}
