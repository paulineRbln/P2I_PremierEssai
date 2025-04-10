import React, { useState, useEffect } from "react";
import "./Proprietaire.css";
import { NotifNews, Notif, FormulaireAjoutElement } from "../GrosElements/Notif";
import { lienAPIMachine } from '../LienAPI/lienAPI';
import { FcApproval } from "react-icons/fc"; // Importer l'icône de validation
import { BoutonSwipe } from '../PetitsElements/RectangleAffichage'; // Importer le BoutonSwipe

export function Proprietaire() {
  const [personneId, setPersonneId] = useState(localStorage.getItem('personneId'));
  const [objets, setObjets] = useState([]);
  const [choixObjet, setChoixObjet] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [popupType2, setPopupType2] = useState(null);
  const [resas, setResas] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [notificationsObjets, setNotificationsObjets] = useState({}); // Stockage des notifications par objet
  const [pageBouton, setPageBouton] = useState("Objets"); // Etat pour gérer l'onglet sélectionné ("Objets" ou "Messagerie")
  const [addObjet, setAddObjet] = useState(null); // Etat pour afficher le formulaire d'ajout d'objet
  const [notificationsMessagerie, setNotificationsMessagerie] = useState(null);

  // Initialisation du ID de la personne
  useEffect(() => {
    const id = localStorage.getItem("personneId");
    if (id) {
      setPersonneId(parseInt(id, 10)); // Convertir en nombre
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
  }, [refresh]);

  // Récupérer les réservations
  useEffect(() => {
    fetch(`${lienAPIMachine()}/association/news/reservations`)  // Utiliser lienAPIMachine
      .then((response) => response.json())
      .then((data) => {
        setResas(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des réservations:", error));
  }, [popupType, refresh, choixObjet]);

  const mesResas = resas.filter((resa) => resa.personneId === personneId);

  // Fonction de gestion du clic sur un objet
  const handleObjetClick = (objet) => {
    setChoixObjet(objet);
    setPopupType(true);  // Ouvre le formulaire de réservation
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
  }, [objets, refresh]); // Se déclenche lorsque les objets sont récupérés

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
  }, [refresh]); // Le refresh permet de recharger les notifications si nécessaire

  const openNotificationPopup = () => {
    setPopupType2(true); // Set the popup type to 'Notif' to show the notification form
  };

  return (
    <div className="page_proprietaire" style={{ backgroundColor: "white", minHeight: "100vh", textAlign: "center" }}>
      <h1>Gérer Votre Koloc Tranquille</h1>

      {/* Formulaire d'ajout d'objet */}
      {addObjet && (
        <FormulaireAjoutElement
          closePopup={() => setAddObjet(false)}
          personneId={personneId}
          type="Objet"
          refresh={setRefresh}
        />
      )}

      {/* Bouton Swipe pour choisir entre "Objets" et "Messagerie" */}
      <BoutonSwipe 
        nom1="Objets" 
        nom2="Messagerie" 
        pageBouton={pageBouton} 
        setChangeBouton={setPageBouton} 
      />

      {/* Affichage des objets si "Objets" est sélectionné */}
      {pageBouton === "Objets" && (
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
                      <NotifNews notifications={notificationsObjets[objet.id]} couleur="#FFCCBC" refresh={setRefresh} />
                    ) : (
                      <FcApproval className="checkmark" /> // Validation si pas de notification
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setAddObjet(true)} className="btn-modif">
                Ajouter un objet
            </button>
          {/* Remplacez le bouton par le RectangleAjout */}
              
              {/* Affichage du formulaire de réservation */}
              {popupType && choixObjet && (
                <FormulaireAjoutElement
                  closePopup={() => setPopupType(false)}
                  personneId={personneId}
                  type="Mes réservations"
                  objetId={choixObjet.id}
                  reservations={resas}
                  refresh={setRefresh}
                  supression={true}
                  descriptionDonnee={choixObjet.description}
                />
              )}
              <Notif titre="Mes réservations" notifications={mesResas} couleur="#E8F5E9" resa={true} refresh={setRefresh} />
        </>
      )}

      {/* Affichage de la messagerie si "Messagerie" est sélectionné */}
      {pageBouton === "Messagerie" && (
        <>
        <button
        className="btn-modif"
        type="button"
        onClick={openNotificationPopup}
      >
        Envoyer un message
      </button>
        <div>
          <NotifNews
                  titre="Messages"
                  notifications={notificationsMessagerie}
                  couleur="#FFCCBC"
                  refresh={setRefresh}
                />
        </div>
        {popupType2 && (
                <FormulaireAjoutElement
                  closePopup={() => setPopupType2(null)} 
                  personneId={localStorage.getItem('personneId')} // Assume personneId is stored in localStorage
                  type="Notif" 
                  refresh={setRefresh}
                />
              )}
        </>
      )}
    </div>
  );
}
