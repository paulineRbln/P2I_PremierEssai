import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Pour récupérer l'ID de l'événement
import { lienAPIMachine } from '../LienAPI/lienAPI'; // Importer la fonction lienAPIMachine
import { Notif } from '../GrosElements/Notif'; // Importer les composants de notifications
import { DescriptionEvent } from '../PetitsElements/RectangleAffichage'; // Importer le composant de description
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import './InfosEvent.css';

function InfosEvent() {
  const { eventId } = useParams(); // Utilise useParams pour obtenir l'ID de l'événement depuis l'URL
  const [eventData, setEventData] = useState(null);
  const [inscrits, setInscrits] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate(); // Initialiser navigate
  
  // Récupérer les données de l'événement
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`${lienAPIMachine()}/element/${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setEventData(data); // Mets à jour les données de l'événement
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
          setInscrits(data);
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
        const response = await fetch(`${lienAPIMachine()}/association/event/${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
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
  }, [eventId]); // Recharger les données à chaque changement de eventId

  if (!eventData) {
    return <p>Chargement des informations de l'événement...</p>;
  }

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

  return (
    <div className="event-info">
      <h1>{eventData.nom}</h1>
      
      <button
        className="suppr_event"
        type="button"
        onClick={handleDelete}
      >
        Supprimer
      </button>

      <DescriptionEvent
        date={eventData.date}
        description={eventData.description}
        listeInscrits={inscrits}
      />

      <Notif
        titre="Notifications de l'événement"
        notifications={notifications}
        couleur="#CFEFEC"
      />
    </div>
  );
}

export default InfosEvent;
