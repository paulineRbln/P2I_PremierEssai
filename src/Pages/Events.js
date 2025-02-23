import React, { useState, useEffect } from 'react';
import "./Events.css";
import { ChoixActions, FormulaireAjoutElement } from '../GrosElements/Notif'; 


function Events() {
  const [showPopup1, setShowPopup1] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [personneId, setPersonneId] = useState(null);

  useEffect(() => {
    // Lire directement l'ID de la personne depuis le localStorage
    const id = localStorage.getItem('personneId');
    if (id) {
      setPersonneId(id);
    }
  }, []); // Ce useEffect se lance une seule fois au montage du composant

  return (
    <div className='page_event' style={{ backgroundColor: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <h1>Tâches et événements</h1>
      <ChoixActions 
        choix1="Tâche" 
        choix2="Event" 
        titre="AJOUTER" 
        eventOnClic1={() => setShowPopup1(!showPopup1)} 
        eventOnClic2={() => setShowPopup2(!showPopup2)}  
      />
      
      {showPopup1 && <FormulaireAjoutElement closePopup={() => setShowPopup1(false)} personneId={personneId} type={"Task"}/>}
      {showPopup2 && <FormulaireAjoutElement closePopup={() => setShowPopup2(false)} personneId={personneId} type={"Event"} />}
    </div>
  );
}

export default Events;
