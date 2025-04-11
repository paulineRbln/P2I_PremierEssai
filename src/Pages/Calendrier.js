import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendrier.css";
import { Notif } from "../GrosElements/Notif";
import { NotifNews } from "../GrosElements/Notif"; 
import { FormulaireAjoutElement } from '../GrosElements/Notif'; 
import { lienAPIMachine } from "../LienAPI/lienAPI"; 

/*
  Ce fichier contient le composant principal pour la gestion du calendrier.
  Il permet d'afficher un calendrier, de gérer les événements, les réservations, et les attributions.
  Les fonctionnalités principales sont :
  - Affichage d'un calendrier : Permet de visualiser les dates et les événements associés.
  - Ajout d'événements : Permet à l'utilisateur d'ajouter un événement à une date sélectionnée.
  - Notifications : Affiche les événements, réservations, et attributions du jour sélectionné.
*/
function Calendrier() {
  const [dateSelectionnee, setDateSelectionnee] = useState(new Date()); // Date sélectionnée dans le calendrier
  const [elements, setElements] = useState([]); // Liste des éléments (événements, réservations, attributions)
  const [rafraichir, setRafraichir] = useState(false); // État pour rafraîchir les éléments affichés
  const [afficherFormulaire, setAfficherFormulaire] = useState(false); // État pour afficher ou cacher le formulaire
  const [personneId, setPersonneId] = useState(localStorage.getItem('personneId')); // Récupère l'ID de la personne connectée

  useEffect(() => {
    const id = localStorage.getItem('personneId');
    if (id) {
      setPersonneId(id);
    }
  }, []);

  useEffect(() => {
    // Récupération des données des éléments associés à la personne (événements, réservations, attributions)
    fetch(`${lienAPIMachine()}/association/news/reservations`)
      .then((response) => response.json())
      .then((dataAssociations) => {
        fetch(`${lienAPIMachine()}/association/attributions`) // Récupérer les attributions
          .then((response) => response.json())
          .then((dataAttributions) => {
            fetch(`${lienAPIMachine()}/element`) // Récupérer les éléments (événements)
              .then((response) => response.json())
              .then((dataElements) => {
                // Séparer les types de données (événements, réservations, attributions)
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
  }, [rafraichir, personneId, dateSelectionnee, elements]);

  // Fonction pour formater la date en format YYYY-MM-DD
  const formaterDate = (date) => {
    const annee = date.getFullYear();
    const mois = (date.getMonth() + 1).toString().padStart(2, "0");
    const jour = date.getDate().toString().padStart(2, "0");
    return `${annee}-${mois}-${jour}`;
  };

  // Fonction pour obtenir la classe CSS à appliquer en fonction de la date
  const obtenirClasseDate = ({ date }) => {
    const dateFormatee = formaterDate(date);
    const estAujourdHui = dateFormatee === formaterDate(new Date()); // Vérifie si la date est aujourd'hui

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

  // Filtrer les événements, réservations et attributions du jour sélectionné
  const evenementsDuJour = elements.filter(
    (element) => formaterDate(new Date(element.date)) === formaterDate(dateSelectionnee) && element.type === "Event"
  );

  const reservationsDuJour = elements.filter(
    (element) => formaterDate(new Date(element.date)) === formaterDate(dateSelectionnee) && element.type === "Reservation"
  );

  const attributionsDuJour = elements.filter(
    (element) => formaterDate(new Date(element.date)) === formaterDate(dateSelectionnee) && element.type === "Attribution"
  );

  // Format des dates pour affichage
  const dateAujourdhui = formaterDate(new Date());
  const dateSelectionneeFormat = formaterDate(dateSelectionnee);

  // Titre pour les notifications (aujourd'hui ou date sélectionnée)
  const titreNotif = dateSelectionneeFormat === dateAujourdhui ? "Aujourd'hui" : dateSelectionneeFormat;

  return (
    <div className="calendrier-container">
      <h1>Calendrier</h1>

      <Calendar
        onChange={setDateSelectionnee}
        value={dateSelectionnee}
        tileClassName={obtenirClasseDate}
      />

      {/* Bouton pour ajouter un événement */}
      <div className="ajoutE" onClick={() => setAfficherFormulaire(!afficherFormulaire)} > {`Ajouter un événement le ${formaterDate(dateSelectionnee)}`} </div>

      {/* Affichage des notifications sous le calendrier pour les événements */}
      {evenementsDuJour.length > 0 && (
        <Notif
          titre={titreNotif}
          notifications={evenementsDuJour}
          couleur="#CFEFEC"
          task={false}
          resa={false}
          refresh={setRafraichir}
        />
      )}

      {/* Affichage des notifications sous le calendrier pour les réservations */}
      {reservationsDuJour.length > 0 && evenementsDuJour.length === 0 && (
        <NotifNews
          titre={titreNotif}
          notifications={reservationsDuJour}
          couleur="#FFCCBC"
          refresh={setRafraichir}
        />
      )}

      {reservationsDuJour.length > 0 && evenementsDuJour.length > 0 && (
        <NotifNews
          titre={""}
          notifications={reservationsDuJour}
          couleur="#FFCCBC"
          refresh={setRafraichir}
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
          refresh={setRafraichir}
        />
      )}

      {/* Affichage du formulaire d'ajout d'événement si afficherFormulaire est vrai */}
      {afficherFormulaire && (
        <FormulaireAjoutElement
          closePopup={() => setAfficherFormulaire(false)} 
          dateDonnee={dateSelectionneeFormat} 
          personneId={personneId} 
          type={"Evenements"} 
          refresh={setRafraichir}
        />
      )}
    </div>
  );
}

export default Calendrier;