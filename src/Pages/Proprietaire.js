import React, { useState, useEffect } from "react";
import "./Proprietaire.css";
import { NotifNews, Notif, FormulaireAjoutElement } from "../GrosElements/Notif";
import { lienAPIMachine } from '../LienAPI/lienAPI';
import { FcApproval } from "react-icons/fc"; // Importer l'icône de validation
import { BoutonSwipe } from '../PetitsElements/RectangleAffichage'; // Importer le BoutonSwipe

/*
  Ce fichier contient le composant principal pour la gestion de la page propriétaire.
  Il permet de gérer les objets, les réservations, et la messagerie. Les fonctionnalités principales sont :
  - Affichage des objets : Permet de visualiser les objets et de gérer leurs notifications.
  - Ajout d'objet : Permet au propriétaire d'ajouter de nouveaux objets à la base de données.
  - Réservations : Permet de consulter et gérer les réservations liées à chaque objet.
  - Messagerie : Permet au propriétaire d'envoyer et de consulter des messages.
  - Notifications : Permet d'afficher les notifications liées aux objets et à la messagerie.
*/

export function Proprietaire() {
  const [idPersonne, setIdPersonne] = useState(localStorage.getItem('personneId'));
  const [objets, setObjets] = useState([]);
  const [objetChoisi, setObjetChoisi] = useState(null);
  const [typePopup, setTypePopup] = useState(null);
  const [typePopup2, setTypePopup2] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [actualiser, setActualiser] = useState(false);
  const [notificationsObjets, setNotificationsObjets] = useState({}); // Stockage des notifications par objet
  const [pageActuelle, setPageActuelle] = useState("Objets"); // Etat pour gérer l'onglet sélectionné ("Objets" ou "Messagerie")
  const [ajouterObjet, setAjouterObjet] = useState(null); // Etat pour afficher le formulaire d'ajout d'objet
  const [notificationsMessagerie, setNotificationsMessagerie] = useState(null);

  // Initialisation de l'ID de la personne
  useEffect(() => {
    const id = localStorage.getItem("personneId");
    if (id) {
      setIdPersonne(parseInt(id, 10)); // Convertir en nombre
    }
  }, []);

  // Récupérer tous les objets (pas seulement ceux du propriétaire)
  useEffect(() => {
    fetch(`${lienAPIMachine()}/element`)
      .then((response) => response.json())
      .then((data) => {
        setObjets(data.filter((item) => item.type === "Objet"));
      })
      .catch((error) => console.error("Erreur lors de la récupération des objets :", error));
  }, [actualiser]);

  // Récupérer les réservations
  useEffect(() => {
    fetch(`${lienAPIMachine()}/association/news/reservations`)  // Utiliser lienAPIMachine
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des réservations:", error));
  }, [typePopup, actualiser, objetChoisi]);

  const mesReservations = reservations.filter((resa) => resa.personneId === idPersonne);

  // Fonction de gestion du clic sur un objet
  const handleObjetClick = (objet) => {
    setObjetChoisi(objet);
    setTypePopup(true);  // Ouvre le formulaire de réservation
  };

  // Récupérer les notifications pour tous les objets au démarrage
  useEffect(() => {
    const fetchNotificationsForAllObjects = async () => {
      try {
        const notifications = {};
        for (const objet of objets) {
          const response = await fetch(`${lienAPIMachine()}/association/events/${objet.id}/notifications`);
          const data = await response.json();
          notifications[objet.id] = data;
        }
        setNotificationsObjets(notifications);
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications pour tous les objets :", error);
      }
    };

    if (objets.length > 0) {
      fetchNotificationsForAllObjects(); // Charger les notifications pour tous les objets au démarrage
    }
  }, [objets, actualiser]); // Se déclenche lorsque les objets sont récupérés

  useEffect(() => {
    const fetchNotificationsMessagerie = async () => {
      try {
        const response = await fetch(`${lienAPIMachine()}/association/notifications/notifs-simple`); // Nouvelle API backend
        if (response.ok) {
          const data = await response.json();
          setNotificationsMessagerie(data.sort((a, b) => b.id - a.id)); // Mettre à jour l'état avec les notifications filtrées
        } else {
          console.error("Erreur lors de la récupération des notifications de messagerie.");
        }
      } catch (error) {
        console.error("Erreur de connexion:", error);
      }
    };

    fetchNotificationsMessagerie(); // Charger les notifications filtrées
  }, [actualiser]); // Le refresh permet de recharger les notifications si nécessaire

  const ouvrirPopupNotification = () => {
    setTypePopup2(true); // Définir le type de popup à 'Notif' pour afficher le formulaire de notification
  };

  return (
    <div className="page_proprietaire" style={{ backgroundColor: "white", minHeight: "100vh", textAlign: "center" }}>
      <h1>Gérer Votre Koloc Tranquille</h1>

      {/* Formulaire d'ajout d'objet */}
      {ajouterObjet && (
        <FormulaireAjoutElement
          closePopup={() => setAjouterObjet(false)}
          personneId={idPersonne}
          type="Objet"
          refresh={setActualiser}
        />
      )}

      {/* Bouton Swipe pour choisir entre "Objets" et "Messagerie" */}
      <BoutonSwipe 
        nom1="Objets" 
        nom2="Messagerie" 
        pageBouton={pageActuelle} 
        setChangeBouton={setPageActuelle} 
      />

      {/* Affichage des objets si "Objets" est sélectionné */}
      {pageActuelle === "Objets" && (
        <>
          {objets.length === 0 ? (
            <p>Aucun objet trouvé.</p>
          ) : (
            <div className="contener_objets">
              {objets.map((objet) => (
                <div key={objet.id} className="div_objet">
                  <h3 onClick={() => handleObjetClick(objet)}>{objet.nom}</h3>
                  {/* Affichage des notifications spécifiques à chaque objet */}
                  <div className="infos-objet">
                    {notificationsObjets[objet.id] && notificationsObjets[objet.id].length > 0 ? (
                      <NotifNews notifications={notificationsObjets[objet.id]} couleur="#FFCCBC" refresh={setActualiser} />
                    ) : (
                      <FcApproval className="checkmark" /> // Validation si pas de notification
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setAjouterObjet(true)} className="btn-modif">
                Ajouter un objet
            </button>

            {/* Affichage du formulaire de réservation */}
            {typePopup && objetChoisi && (
              <FormulaireAjoutElement
                closePopup={() => setTypePopup(false)}
                personneId={idPersonne}
                type="Mes réservations"
                objetId={objetChoisi.id}
                reservations={reservations}
                refresh={setActualiser}
                supression={true}
                descriptionDonnee={objetChoisi.description}
              />
            )}
            <Notif titre="Mes réservations" notifications={mesReservations} couleur="#E8F5E9" resa={true} refresh={setActualiser} />
        </>
      )}

      {/* Affichage de la messagerie si "Messagerie" est sélectionné */}
      {pageActuelle === "Messagerie" && (
        <>
          <button
            className="btn-modif"
            type="button"
            onClick={ouvrirPopupNotification}
          >
            Envoyer un message
          </button>
          <div>
            <NotifNews
              titre="Messages"
              notifications={notificationsMessagerie}
              couleur="#FFCCBC"
              refresh={setActualiser}
            />
          </div>
          {typePopup2 && (
            <FormulaireAjoutElement
              closePopup={() => setTypePopup2(null)} 
              personneId={localStorage.getItem('personneId')} // Assume personneId is stored in localStorage
              type="Notif" 
              refresh={setActualiser}
            />
          )}
        </>
      )}
    </div>
  );
}
