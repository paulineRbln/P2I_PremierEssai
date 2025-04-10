import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendrier.css"; // Importer le fichier CSS
import { Notif } from "../GrosElements/Notif";
import { NotifNews } from "../GrosElements/Notif"; // Assurez-vous que NotifNews est importé
import { FormulaireAjoutElement } from '../GrosElements/Notif'; // Importez le formulaire d'ajout d'événement
import { lienAPIMachine } from "../LienAPI/lienAPI"; // Importer la fonction lienAPIMachine

function Calendrier() {
  const [dateSelectionnee, setDateSelectionnee] = useState(new Date());
  const [elements, setElements] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false); // Etat pour afficher ou cacher le formulaire
  const [personneId, setPersonneId] = useState(localStorage.getItem('personneId'));

  useEffect(() => {
    const id = localStorage.getItem('personneId');
    if (id) {
      setPersonneId(id);
    }
  }, []);

  useEffect(() => {
    fetch(`${lienAPIMachine()}/association/news/reservations`)
      .then((response) => response.json())
      .then((dataAssociations) => {
        fetch(`${lienAPIMachine()}/association/attributions`) // Modifier l'URL pour récupérer les attributions
          .then((response) => response.json())
          .then((dataAttributions) => {
            fetch(`${lienAPIMachine()}/element`)
              .then((response) => response.json())
              .then((dataElements) => {
                // Séparer les types de données
                const evenements = dataElements.filter((e) => e.type === "Event");

                // Fusionner les données récupérées : réservations, événements et attributions
                setElements([
                  ...dataAssociations,  // Réservations
                  ...evenements,        // Événements
                  ...dataAttributions,  // Attributions
                ]);
              })
              .catch((error) =>
                console.error("Erreur lors de la récupération des éléments:", error)
              );
          })
          .catch((error) =>
            console.error("Erreur lors de la récupération des attributions:", error)
          );
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des associations:", error)
      );
  }, [refresh, personneId, dateSelectionnee, elements]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const obtenirClasseDate = ({ date }) => {
    const dateFormatee = formatDate(date);
    const estAujourdHui = dateFormatee === formatDate(new Date()); // Vérifie si la date est aujourd'hui

    const contientEvenement = elements.some(
      (element) => element.date === dateFormatee && element.type === "Event"
    );
    const contientAttribution = elements.some(
      (element) => element.date === dateFormatee && element.type === "Attribution"
    );
    const contientReservation = elements.some(
      (element) => element.date === dateFormatee && element.type === "Reservation"
    );

    const multipleTypes = [contientEvenement, contientAttribution, contientReservation].filter(Boolean).length > 1;

    // Appliquer des classes conditionnelles
    if (estAujourdHui) return "jour-aujourdhui"; // Classe spécifique pour le jour actuel
    if (multipleTypes) return "jour-multiple-types";
    if (contientEvenement) return "jour-evenement";
    if (contientAttribution) return "jour-attribution";
    if (contientReservation) return "jour-reservation";
    return null;
  };

  const evenementsDuJour = elements.filter(
    (element) => formatDate(new Date(element.date)) === formatDate(dateSelectionnee) && element.type === "Event"
  );

  const reservationsDuJour = elements.filter(
    (element) => formatDate(new Date(element.date)) === formatDate(dateSelectionnee) && element.type === "Reservation"
  );

  const attributionsDuJour = elements.filter(
    (element) => formatDate(new Date(element.date)) === formatDate(dateSelectionnee) && element.type === "Attribution"
  );

  const dateAujourdhui = formatDate(new Date());
  const dateSelectionneeFormat = formatDate(dateSelectionnee);

  const titreNotif = dateSelectionneeFormat === dateAujourdhui ? "Aujourd'hui" : dateSelectionneeFormat;

  return (
    <div className="calendrier-container">
      <h1>Calendrier</h1>

      <Calendar
        onChange={setDateSelectionnee}
        value={dateSelectionnee}
        tileClassName={obtenirClasseDate}
      />

      <div className="ajoutE" onClick={() => setShowForm(!showForm)} > {`Ajouter un evenement le ${formatDate(dateSelectionnee)}`} </div>

      {/* Affichage des notifications sous le calendrier pour les événements */}
      {evenementsDuJour.length > 0 && (
        <Notif
          titre={titreNotif}
          notifications={evenementsDuJour}
          couleur="#CFEFEC"
          task={false}
          resa={false}
          refresh={setRefresh}
        />
      )}

      {/* Affichage des notifications sous le calendrier pour les réservations */}
      {reservationsDuJour.length > 0 && evenementsDuJour.length === 0 && (
        <NotifNews
          titre={titreNotif}
          notifications={reservationsDuJour}
          couleur="#FFCCBC"
          refresh={setRefresh}
        />
      )}

      {reservationsDuJour.length > 0 && evenementsDuJour.length > 0 && (
        <NotifNews
          titre={""}
          notifications={reservationsDuJour}
          couleur="#FFCCBC"
          refresh={setRefresh}
        />
      )}

      {/* Affichage des notifications sous le calendrier pour les attributions */}
      {attributionsDuJour.length > 0 && (
        <NotifNews
          titre={""}
          notifications={attributionsDuJour}
          couleur="#E8F5E9"  // Couleur spécifique pour les attributions
          task={true}  // Gardez 'true' ici pour signaler que ce sont des attributions
          resa={false}
          refresh={setRefresh}
        />
      )}

      {/* Affichage du formulaire d'ajout d'événement si showForm est vrai */}
      {showForm && (
        <FormulaireAjoutElement
          closePopup={() => setShowForm(false)} 
          dateDonnee={dateSelectionneeFormat} 
          personneId={personneId} 
          type={"Evenements"} 
          refresh={setRefresh}
        />
      )}
    </div>
  );
}

export default Calendrier;
