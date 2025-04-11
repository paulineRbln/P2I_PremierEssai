// Maison.js
import React, { useState, useEffect } from "react";
import "./Maison.css";
import { ChoixObjet, NotifNews, Notif, FormulaireAjoutElement } from "../GrosElements/Notif";
import { BoutonSwipe } from "../PetitsElements/RectangleAffichage";
import { lienAPIMachine } from '../LienAPI/lienAPI'; // Importer la fonction lienAPIMachine

/*
  Ce fichier contient le composant principal pour la gestion de la page "Maison".
  Il permet de gérer les objets, les réservations, et les notifications. Les fonctionnalités principales sont :
  - Affichage des objets : Permet de visualiser les objets disponibles et de les gérer.
  - Réservations : Permet de consulter et de gérer les réservations liées à chaque objet.
  - Ajout d'objet : Permet d'ajouter de nouveaux objets.
  - Notifications : Permet d'afficher les notifications relatives aux objets et aux réservations en cas de problème sur un objet.
*/
/*
  Ce fichier contient le composant principal pour la gestion de la page "Maison".
  Il permet de gérer les objets, les réservations, et les notifications. Les fonctionnalités principales sont :
  - Affichage des objets : Permet de visualiser les objets disponibles et de les gérer.
  - Réservations : Permet de consulter et de gérer les réservations liées à chaque objet.
  - Ajout d'objet : Permet au propriétaire d'ajouter de nouveaux objets.
  - Notifications : Permet d'afficher les notifications relatives aux objets et aux réservations.
*/

function Maison() {
  const [popupType, setPopupType] = useState(null);
  const [ajouterObjet, setAjouterObjet] = useState(null);
  const [personneId, setPersonneId] = useState(localStorage.getItem('personneId'));
  const [objets, setObjets] = useState([]);
  const [choixObjet, setChoixObjet] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [pageBouton, setPageBouton] = useState("Mes réservations"); // Défaut : voir mes réservations
  const [actualiser, setActualiser] = useState(false);

  // Récupérer l'ID de la personne depuis le localStorage
  useEffect(() => {
    const id = localStorage.getItem("personneId");
    if (id) {
      setPersonneId(parseInt(id, 10)); // Convertir en nombre
    }
  }, []);

  // Récupérer les objets depuis l'API
  useEffect(() => {
    fetch(`${lienAPIMachine()}/element`)  // Utiliser lienAPIMachine
      .then((response) => response.json())
      .then((data) => {
        setObjets(data.filter((item) => item.type === "Objet"));
      })
      .catch((error) => console.error("Erreur lors de la récupération des objets:", error));
  }, [actualiser]);

  // Récupérer les réservations depuis l'API
  useEffect(() => {
    fetch(`${lienAPIMachine()}/association/news/reservations`)  // Utiliser lienAPIMachine
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des associations:", error));
  }, [pageBouton, popupType, actualiser]);

  // Gestion du clic sur un objet
  const handleObjetClick = (objet) => {
    setChoixObjet(objet);
    setPopupType(true); // Ouvrir le popup pour l'objet choisi
  };

  // Filtrer les réservations de la personne actuelle
  const mesResas = reservations.filter((resa) => resa.personneId === personneId);
  const autresResas = reservations.filter((resa) => resa.personneId !== personneId);

  return (
    <div className="page_objets" style={{ backgroundColor: "white", minHeight: "100vh", textAlign: "center" }}>
      <h1>Appareils et salles</h1>

      <ChoixObjet listeObjets={objets} eventOnClic={handleObjetClick} addObjet={setAjouterObjet} />

      {/* Affichage du formulaire d'ajout d'objet ou réservation lorsque l'objet est choisi */}
      {popupType && choixObjet && (
        <FormulaireAjoutElement
          closePopup={() => setPopupType(false)}
          personneId={personneId}
          type="Mes réservations"
          objetId={choixObjet.id}
          reservations={reservations}
          setBouton={setPageBouton} // Passer setPageBouton pour changer d'affichage après réservation
          refresh={setActualiser}
          supression={true}
          descriptionDonnee={choixObjet.description}
        />
      )}

      {/* Affichage du formulaire d'ajout d'objet */}
      {ajouterObjet && (
        <FormulaireAjoutElement
          closePopup={() => setAjouterObjet(false)}
          personneId={personneId}
          type="Objet"
          refresh={setActualiser}
        />
      )}

      {/* Bouton de navigation entre les réservations personnelles et celles des autres */}
      <BoutonSwipe
        nom1="Mes réservations"
        nom2="Autres réservations"
        pageBouton={pageBouton}
        setChangeBouton={setPageBouton}
      />

      {/* Affichage des réservations des autres */}
      {pageBouton === "Autres réservations" && (
        <NotifNews titre="Réservations des autres" notifications={autresResas} couleur="#FFCCBC" resa={true} />
      )}

      {/* Affichage des réservations de l'utilisateur */}
      {pageBouton === "Mes réservations" && (
        <Notif titre="Mes réservations" notifications={mesResas} couleur="#E8F5E9" resa={true} refresh={setActualiser} />
      )}
    </div>
  );
}

export default Maison;
