import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { lienAPIMachine } from '../LienAPI/lienAPI'; 
import { NotifNews } from '../GrosElements/Notif'; 
import { DescriptionEvent } from '../PetitsElements/RectangleAffichage'; 
import { useNavigate } from 'react-router-dom'; 
import { FormulaireAjoutElement } from '../GrosElements/Notif'; 
import './InfosEvent.css';

/*
  Ce fichier contient le composant principal pour la gestion des informations d'un événement.
  Il permet de récupérer et afficher les informations d'un événement spécifique, y compris les inscrits et les notifications.
  Les fonctionnalités principales sont :
  - Affichage des informations de l'événement : Permet de visualiser le nom, la date et la description de l'événement.
  - Gestion des inscriptions : Permet de récupérer et afficher la liste des inscrits à l'événement.
  - Gestion des notifications : Permet d'afficher les notifications liées à l'événement et d'envoyer de nouvelles notifications.
  - Suppression d'événement : Permet de supprimer l'événement de la base de données.
  - Gestion de popup : Permet d'ouvrir un formulaire pour ajouter des notifications.
*/

function InfosEvent() {
  const { eventId } = useParams(); // Utilise useParams pour obtenir l'ID de l'événement depuis l'URL
  const [eventData, setEventData] = useState(null); 
  const [inscrits, setInscrits] = useState([]); 
  const [notifications, setNotifications] = useState([]); // Liste des notifications associées à l'événement
  const [popupType, setPopupType] = useState(null); // Gérer l'affichage des popups
  const navigate = useNavigate(); 
  const [actualiser, setActualiser] = useState(false); 
  
  // Récupérer les données de l'événement
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`${lienAPIMachine()}/element/${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setEventData(data); // Mettre à jour les données de l'événement
        } else {
          console.error("Erreur lors de la récupération des informations de l'événement.");
        }
      } catch (error) {
        console.error("Erreur de connexion:", error);
      }
    };

    // Récupérer les inscrits à l'événement
    const fetchInscrits = async () => {
      try {
        const response = await fetch(`${lienAPIMachine()}/element/${eventId}/inscrits`);
        if (response.ok) {
          const data = await response.json();
          setInscrits(data); // Mettre à jour la liste des inscrits
        } else {
          console.error("Erreur lors de la récupération des inscrits.");
        }
      } catch (error) {
        console.error("Erreur de connexion:", error);
      }
    };

    // Récupérer les notifications associées à cet événement
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${lienAPIMachine()}/association/events/${eventId}/notifications`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.sort((a, b) => b.id - a.id)); // Trier les notifications par ID décroissant
        } else {
          console.error("Erreur lors de la récupération des notifications.");
        }
      } catch (error) {
        console.error("Erreur de connexion:", error);
      }
    };

    // Exécuter toutes les requêtes
    fetchEventData();
    fetchInscrits();
    fetchNotifications();
  }, [eventId, popupType, actualiser]); // Recharger les données lorsque l'ID de l'événement, popupType ou actualiser changent

  // Affichage si les données de l'événement ne sont pas encore récupérées
  if (!eventData) {
    return <p>Chargement des informations de l'événement...</p>;
  }

  // Fonction de suppression de l'événement
  const handleDelete = async () => {
    try {
      const response = await fetch(`${lienAPIMachine()}/element/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        alert("Erreur lors de la suppression de l'élément.");
      } else {
        // Revenir à la page précédente après la suppression
        navigate(-1); // Retour à la page précédente
      }
    } catch (error) {
      alert("Une erreur s'est produite lors de la suppression.");
    } 
  };

  // Fonction pour ouvrir le popup de création de notification
  const openNotificationPopup = () => {
    setPopupType('Notif'); // Définir le type de popup à 'Notif' pour afficher le formulaire de notification
  };

  return (
    <div className="event-info">
      <h1>{eventData.nom}</h1>
      
      <button
        className="suppr_event"
        type="button"
        onClick={handleDelete} // Appeler la fonction de suppression lorsque le bouton est cliqué
      >
        Supprimer
      </button>

      <DescriptionEvent
        date={eventData.date} 
        description={eventData.description} 
        listeInscrits={inscrits} 
      />

      {/* Bouton pour ajouter une nouvelle notification */}
      <button
        className="btn-modif"
        type="button"
        onClick={openNotificationPopup} // Ouvrir le formulaire de notification lorsque le bouton est cliqué
      >
        Envoyer un message
      </button>

      {/* Affichage des notifications associées à l'événement */}
      <NotifNews
        titre="Notifications de l'évènement"
        notifications={notifications} 
        couleur="#FFCCBC"
        refresh={setActualiser} 
      />

      {/* Affichage du formulaire de notification si le popup est ouvert */}
      {popupType && (
        <FormulaireAjoutElement
          closePopup={() => setPopupType(null)} // Fermer le popup lorsque l'on clique pour fermer
          personneId={localStorage.getItem('personneId')} 
          type="Notif" 
          eventId={eventId} 
          refresh={() => {}} 
        />
      )}
    </div>
  );
}

export default InfosEvent;
