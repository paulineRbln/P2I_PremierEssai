import React, {useState} from 'react';
import { RectangleAjout, RectangleAffichage } from '../PetitsElements/RectangleAffichage';
import './Notif.css'; // Si tu as des styles supplémentaires
import {FaTimes} from  'react-icons/fa';

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

export function ChoixActions({choix1, choix2, titre, eventOnClic1, eventOnClic2 }) {
  
  return (
    <div className="choix_actions">
      <h2 className='titre'>{titre}</h2>
      <div className='bloc_rectangles'>
        <RectangleAjout texte={choix1} couleur={"#1A237E"} eventOnClic={eventOnClic1}/>
        <RectangleAjout texte={choix2} couleur={"#1A237E"} eventOnClic={eventOnClic2}/>
      </div>
    </div>
  );
}


export function FormulaireAjoutEvent({ closePopup, personneId }) {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const nouvelEvenement = {
      id: 0, // Géré par la BDD
      nom,
      description,
      type: "Event",
      estFait: false, // Un événement n'est pas "fait" par défaut
      date,
    };
  
    try {
      // 1. Créer l'événement
      const response = await fetch("http://localhost:5222/api/element", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouvelEvenement),
      });
  
      if (response.ok) {
        const eventData = await response.json(); // Récupère les données de l'événement créé  
     
        const association = {
          personneId, // Utilise l'ID de la personne depuis le localStorage
          elementId: eventData.id, // ID de l'événement créé
          type: "Inscription", // Type d'association, ici c'est un événement
          date: "", // Pas de date spécifiée
        };
  
        // Envoie la requête pour créer l'association
        const associationResponse = await fetch("http://localhost:5222/api/association", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(association),
        });
  
        if (!associationResponse.ok) {
          alert("Erreur lors de l'inscription à l'événement");
        }
      } else {
        alert("Erreur lors de l'ajout de l'événement");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur s'est produite");
    }
  };
  

  return (
    <div className="modal-overlay" onClick={closePopup}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="connexion-container">
          <form onSubmit={handleSubmit}>
            <div>
              <h3>Titre de l'événement</h3>
              <input
                type="text"
                className="encadre"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
            <div>
              <h3>Infos supplémentaires</h3>
              <textarea
                className="encadre"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <h3>Date de l'événement</h3>
              <input
                type="date"
                className="encadre"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <button className="connecter" type="submit">Ajouter</button>
          </form>
          <button className="btn-fermer" type="button" onClick={closePopup}>
            <FaTimes className="close-icon" /> {/* Utilisation de l'icône croix */}
            </button>
        </div>
      </div>
    </div>
  );
}
