import React, { useState, useEffect } from 'react';
import "./Maison.css";
import { ChoixObjet , NotifNews, FormulaireAjoutElement} from '../GrosElements/Notif';

function Maison() {
  const [popupType, setPopupType] = useState(null); 
  const [personneId, setPersonneId] = useState(null);
  const [objets, setObjets] = useState([]);
  const [choixObjet, setChoixObjet] = useState(null); // Pour garder une trace du choix de l'objet
  const [resas, setResas] = useState(null); // Pour garder une trace du choix de l'objet

  useEffect(() => {
    const id = localStorage.getItem('personneId');
    if (id) {
      setPersonneId(id);
    }
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5222/api/element`)
      .then(response => response.json())
      .then(data => {
        setObjets(data.filter(item => item.type === 'Objet')); // On filtre les objets
      })
      .catch(error => console.error('Erreur lors de la récupération des objets:', error));
  }, []); // Cette dépendance est vide, donc l'appel API se fait seulement au premier rendu

  useEffect(() => {
    fetch(`http://localhost:5222/api/association/news/reservations`)
      .then(response => response.json())
      .then(data => {
        setResas(data);  // Mettre à jour l'état avec les réservations récupérées
      })
      .catch(error => console.error('Erreur lors de la récupération des réservations:', error));
  }, []);

  // Fonction appelée lors du clic sur un objet
  const handleObjetClick = (objet) => {
    setChoixObjet(objet); // Mettre à jour l'état avec l'objet sélectionné
    setPopupType (true);
  };

  return (
    <div className='page_objets' style={{ backgroundColor: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <h1>Appareils et salles</h1>
      {/* Passer les objets récupérés au composant ChoixObjet */}
      <ChoixObjet listeObjets={objets} eventOnClic={handleObjetClick} />
      {popupType && choixObjet && (
        <FormulaireAjoutElement 
          closePopup={() => setPopupType(false)}
          personneId={personneId}
          type="Reservation"
          objetId={choixObjet} // Passer l'ID de l'objet sélectionné
        />
      )}
      <NotifNews
              titre="Réservations en cours"
              notifications={resas}
              couleur="#FFCCBC"
              resa = {true}
            />
    </div>
  );
}

export default Maison;
