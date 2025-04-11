// Events.js
import React, { useState, useEffect } from 'react';
import "./Events.css";
import { ChoixActions, FormulaireAjoutElement, Notif } from '../GrosElements/Notif'; 
import { BoutonSwipe } from '../PetitsElements/RectangleAffichage';
import { lienAPIMachine } from '../LienAPI/lienAPI'; // Importer la fonction lienAPIMachine

/*
  Ce fichier contient le composant principal pour la gestion des événements et des tâches.
  Il permet de visualiser, ajouter et gérer les événements et les tâches. Les fonctionnalités principales sont :
  - Affichage des événements et des tâches : Permet de voir la liste des événements à venir et des tâches à accomplir.
  - Ajouter un événement ou une tâche : Permet à l'utilisateur d'ajouter de nouveaux événements ou tâches.
  - Gestion des notifications : Permet d'afficher les notifications liées aux événements et aux tâches.
*/

function Events() {
  const [popupType, setPopupType] = useState(null); // Type de popup à afficher (Event ou Task)
  const [personneId, setPersonneId] = useState(localStorage.getItem('personneId')); // Récupération de l'ID de la personne depuis le localStorage
  const [pageBouton, setPageBouton] = useState("Evenements"); // Définit la page courante (Evenements ou Tâches)
  const [refresh, setRefresh] = useState(false); // Permet de rafraîchir les données

  const [evenements, setEvenements] = useState([]); // Liste des événements à afficher
  const [taches, setTaches] = useState([]); // Liste des tâches à afficher

  // Récupération de l'ID de la personne au chargement du composant
  useEffect(() => {
    const id = localStorage.getItem('personneId');
    if (id) {
      setPersonneId(id);
    }
  }, []);

  // Récupération des événements et tâches depuis l'API
  useEffect(() => {
    fetch(`${lienAPIMachine()}/element`)  
      .then(response => response.json()) 
      .then(data => {
        // Filtrer et trier les données
        const evenementsData = data.filter(item => item.type === 'Event');
        const tachesData = data.filter(item => item.type === 'Task');
        evenementsData.sort((a, b) => b.id - a.id);
        tachesData.sort((a, b) => b.id - a.id);
        
        setEvenements(evenementsData); // Mise à jour de la liste des événements
        setTaches(tachesData); // Mise à jour de la liste des tâches
      })
      .catch(error => console.error('Erreur:', error));
  }, [popupType, pageBouton, refresh]);

  return (
    <div className='page_event' style={{ backgroundColor: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <h1>Tâches et événements</h1>

      {/* Sélection du type d'élément à ajouter (Événement ou Tâche) */}
      <ChoixActions 
        choix1="Event" 
        choix2="Tâche" 
        titre="AJOUTER" 
        eventOnClic1={() => setPopupType("Evenements")}  // Afficher le formulaire pour un événement
        eventOnClic2={() => setPopupType("Tâches")}  // Afficher le formulaire pour une tâche
      />
      
      {/* Navigation entre les pages "Evenements" et "Tâches" */}
      <BoutonSwipe nom1="Evenements" nom2="Tâches" pageBouton={pageBouton} setChangeBouton={setPageBouton} />

      {/* Affichage du formulaire d'ajout si un type est sélectionné */}
      {popupType && (
        <FormulaireAjoutElement 
          closePopup={() => setPopupType(null)} // Ferme le formulaire
          personneId={personneId} 
          type={popupType} 
          setBouton={setPageBouton}
          refresh={setRefresh}
        />
      )}

      {/* Affichage des tâches si la page active est "Tâches" */}
      {pageBouton === "Tâches" && (
        <Notif
          titre="Tâches à faire"
          notifications={taches}
          couleur="#E8F5E9"
          task={true}
          refresh={setRefresh}
        />
      )}

      {/* Affichage des événements si la page active est "Evenements" */}
      {pageBouton === "Evenements" && (
        <Notif
          titre="Evénements à venir"
          notifications={evenements}
          couleur="#CFEFEC"
          refresh={setRefresh}
        />
      )}
    </div>
  );
}

export default Events;
