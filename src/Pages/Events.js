// Events.js
import React, { useState, useEffect } from 'react';
import "./Events.css";
import { ChoixActions, FormulaireAjoutElement, Notif } from '../GrosElements/Notif'; 
import { BoutonSwipe } from '../PetitsElements/RectangleAffichage';
import { lienAPIMachine } from '../LienAPI/lienAPI'; // Importer la fonction lienAPIMachine

function Events() {
  const [popupType, setPopupType] = useState(null); // "Task", "Event" ou null
  const [personneId, setPersonneId] = useState(localStorage.getItem('personneId'));
  const [pageBouton, setPageBouton] = useState("Evenements");
  const [refresh, setRefresh] = useState(false);

  const [evenements, setEvenements] = useState([]);
  const [taches, setTaches] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem('personneId');
    if (id) {
      setPersonneId(id);
    }
  }, []);

  useEffect(() => {
    fetch(`${lienAPIMachine()}/element`)  // Utiliser lienAPIMachine pour l'URL
      .then(response => response.json())
      .then(data => {
        setEvenements(data.filter(item => item.type === 'Event'));
        setTaches(data.filter(item => item.type === 'Task'));
      })
      .catch(error => console.error('Erreur lors de la récupération des éléments:', error));
  }, [popupType, pageBouton, refresh]);

  return (
    <div className='page_event' style={{ backgroundColor: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <h1>Tâches et événements</h1>

      <ChoixActions 
        choix1="Event" 
        choix2="Tâche" 
        titre="AJOUTER" 
        eventOnClic1={() => setPopupType("Evenements")}  
        eventOnClic2={() => setPopupType("Tâches")}  
      />
      
      <BoutonSwipe nom1="Evenements" nom2="Tâches" pageBouton={pageBouton} setChangeBouton={setPageBouton} />

      {popupType && (
        <FormulaireAjoutElement 
          closePopup={() => setPopupType(null)} 
          personneId={personneId} 
          type={popupType} 
          setBouton={setPageBouton}
          refresh={setRefresh}
        />
      )}

      {pageBouton === "Tâches" && (
        <Notif
          titre="Tâches à faire"
          notifications={taches}
          couleur="#E8F5E9"
          task={true}
          refresh={setRefresh}
        />
      )}

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
