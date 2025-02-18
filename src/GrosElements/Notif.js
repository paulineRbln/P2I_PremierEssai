import React from 'react';
import RectangleAffichage from '../PetitsElements/RectangleAffichage'; // Assure-toi que ce fichier existe
import './Notif.css'; // Si tu as des styles supplémentaires

export function Notif({ titre, notifications, couleur, task }) {
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
          date = {notif.date}
        />
      ))}
    </div>
  );
}

export function NotifNews({ titre, notifications, couleur }) {
  return (
    <div className="notif">
      <h3>{titre}</h3>
      {notifications.map((notif, index) => {
          return (
            <RectangleAffichage
              key={index}
              textGras={
                notif.type === "Inscription"
                  ? "Nouvelle inscription à votre événement"
                  : notif.type === "Reservation"
                  ? "Nouvelle réservation"
                  : "Notification"
              }
              textPetit={
                notif.type === "Inscription"
                  ? `${notif.personneName} s'est inscrit à ${notif.elementName}`
                  : notif.type === "Reservation"
                  ? `${notif.personneName} a réservé ${notif.elementName} pour le ${notif.date}`
                  : "Détails de la notification non disponibles."
              }
              couleur={couleur}
            />
          );
        })
      }
    </div>
  );
}