import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendrier.css"; // Importer le fichier CSS
import { Notif } from "../GrosElements/Notif";
import { NotifNews } from "../GrosElements/Notif"; // Assurez-vous que NotifNews est importé
import { FormulaireAjoutElement } from '../GrosElements/Notif'; // Importez le formulaire d'ajout d'événement

function Calendrier() {
  const [dateSelectionnee, setDateSelectionnee] = useState(new Date());
  const [elements, setElements] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false); // Etat pour afficher ou cacher le formulaire
  const [personneId, setPersonneId] = useState(null);
  
    useEffect(() => {
      // Lire directement l'ID de la personne depuis le localStorage
      const id = localStorage.getItem('personneId');
      if (id) {
        setPersonneId(id);
      }
    }, []); // Ce useEffect se lance une seule fois au montage du composant

  useEffect(() => {
    // Récupérer les données de /api/association pour les réservations
    fetch("http://localhost:5222/api/association/news/reservations")
      .then((response) => response.json())
      .then((dataAssociations) => {
        // Récupérer les événements de /api/element
        fetch("http://localhost:5222/api/element")
          .then((response) => response.json())
          .then((dataElements) => {
            // Filtrer uniquement les événements de /api/element
            const evenements = dataElements.filter((e) => e.type === "Event");
            // Fusionner les deux sources de données
            setElements([...dataAssociations, ...evenements]);
          })
          .catch((error) =>
            console.error("Erreur lors de la récupération des événements :", error)
          );
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des associations :", error)
      );
  }, [refresh]);

  // Fonction pour formater la date au format YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Mois avec un 0 devant si nécessaire
    const day = date.getDate().toString().padStart(2, "0"); // Jour avec un 0 devant si nécessaire
    return `${year}-${month}-${day}`;
  };

  const obtenirClasseDate = ({ date }) => {
    const dateFormatee = formatDate(date); // Utilisation de formatDate() pour la date locale au format YYYY-MM-DD
    const jourSemaine = date.getDay(); // 0 = Dimanche, 6 = Samedi
    const estWeekend = jourSemaine === 0 || jourSemaine === 6;

    // Vérifier les types d'éléments pour la date sélectionnée
    const contientEvenement = elements.some(
      (element) => element.date === dateFormatee && element.type === "Event"
    );
    const contientTache = elements.some(
      (element) => element.date === dateFormatee && element.type === "Task"
    );
    const contientReservation = elements.some(
      (element) => element.date === dateFormatee && element.type === "Reservation"
    );

    // Vérifier si plusieurs types d'éléments sont présents pour ce jour
    const multipleTypes = [contientEvenement, contientTache, contientReservation].filter(Boolean).length > 1;

    // Appliquer les classes en fonction des conditions
    if (estWeekend) return "weekend"; // Applique la classe 'weekend' pour les week-ends
    if (multipleTypes) return "jour-multiple-types"; // Applique la classe 'jour-multiple-types' pour plusieurs types d'éléments
    if (contientEvenement) return "jour-evenement"; // Applique la classe 'jour-evenement' pour un événement
    if (contientTache) return "jour-tache"; // Applique la classe 'jour-tache' pour une tâche
    if (contientReservation) return "jour-reservation"; // Applique la classe 'jour-reservation' pour une réservation
    return null;
  };

  // Récupérer les événements et réservations pour la date sélectionnée
  const evenementsDuJour = elements.filter(
    (element) => formatDate(new Date(element.date)) === formatDate(dateSelectionnee) && element.type === "Event"
  );

  const reservationsDuJour = elements.filter(
    (element) => formatDate(new Date(element.date)) === formatDate(dateSelectionnee) && element.type === "Reservation"
  );

  // Vérifier si la date sélectionnée est aujourd'hui
  const dateAujourdhui = formatDate(new Date());
  const dateSelectionneeFormat = formatDate(dateSelectionnee);

  const titreNotif = dateSelectionneeFormat === dateAujourdhui ? "Aujourd'hui" : dateSelectionneeFormat;



  return (
    <div className="calendrier-container">
      <h1>Calendrier</h1>

      <Calendar
        onChange={setDateSelectionnee}
        value={dateSelectionnee}
        tileClassName={obtenirClasseDate} // Appliquer la classe CSS selon le type d'élément
      />

      <div className="ajoutE" onClick={() => setShowForm(!showForm)} > {"Ajouter un evenement"} </div>


      {/* Affichage des notifications sous le calendrier pour les événements */}
      {evenementsDuJour.length > 0 && (
        <Notif
          titre={titreNotif}
          notifications={evenementsDuJour} // Utiliser evenementsDuJour ici
          couleur="#CFEFEC" // Bleu foncé, à ajuster selon besoin
          task={false}
          resa={false}
          refresh={setRefresh}
        />
      )}

      {/* Affichage des notifications sous le calendrier pour les réservations */}
      {reservationsDuJour.length > 0 && evenementsDuJour.length === 0 && (
        <NotifNews
          titre={titreNotif}
          notifications={reservationsDuJour} // Utiliser reservationsDuJour ici
          couleur="#FFCCBC" // Couleur spécifique pour les réservations
          refresh={setRefresh}
        />
      )}

      {reservationsDuJour.length > 0 && evenementsDuJour.length > 0 && (
        <NotifNews
          titre={""}
          notifications={reservationsDuJour} // Utiliser reservationsDuJour ici
          couleur="#FFCCBC" // Couleur spécifique pour les réservations
          refresh={setRefresh}
        />
      )}
      

      {/* Affichage du formulaire d'ajout d'événement si showForm est vrai */}
      {showForm && (
        <FormulaireAjoutElement
          closePopup={() => setShowForm(false)} 
          dateDonnee={dateSelectionneeFormat} // Passer la date sélectionnée
          personneId={personneId} 
          type={"Evenements"} 
          refresh={setRefresh}
        />
      )}
    </div>
  );
}

export default Calendrier;
