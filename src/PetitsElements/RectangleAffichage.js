import React, { useState, useEffect } from 'react';
import './RectangleAffichage.css'; // Importer le fichier CSS


export function RectangleAffichage({ textGras, textPetit, couleur, task, estFait, date, association, typeE, personneId, elementId }) {
  // État pour gérer la case à cocher (lue ou non)
  const [checked, setChecked] = useState(estFait);  // Initialiser avec l'association
  const [associe, setAssocie] = useState(association);  // Initialiser avec l'association

  // Fonction pour gérer l'activation de la case à cocher (ajout de l'association)
  const handleCheckboxChange = () => {
    // Déterminer le type d'association à créer : inscription pour événement, attribution pour tâche
    const typeAssociation = typeE === "Event" ? "Inscription" :
                            typeE === "Task" ? "Attribution" :
                            typeE === "Objet" ? "Reservation" : "Default";

    fetch('http://localhost:5222/api/association', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personneId: personneId,
        elementId: elementId,
        type: typeAssociation,
        date: "", // Si tu veux envoyer null pour la date, laisse cette ligne
      }),
    })
    .then((response) => {
      if (!response.ok) {
        console.error('Échec de la création de l\'association');
      }
      else{
        setAssocie(!associe);
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la création de l\'association', error);
    });
  };

  // Fonction pour gérer le désistement (suppression de l'association)
  const handleCheckboxChange2 = () => {
    // Récupérer l'ID de l'association en fonction de personneId et elementId
    fetch(`http://localhost:5222/api/association/personne/${personneId}/element/${elementId}`)
      .then(response => response.json())
      .then(data => {
        // data contient l'ID de l'association
        const associationId = data.id;
        
        // Supprimer l'association avec l'ID
        fetch(`http://localhost:5222/api/association/${associationId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          if (!response.ok) {
            console.error('Échec de la suppression de l\'association');
          } else {
            setAssocie(!associe); // Réinitialiser l'état de la case à cocher
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression de l\'association', error);
        });
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de l\'ID de l\'association', error);
      });
  };

  const handleEstFaitChange = () => {
    setChecked(!checked);
  }

  return (
    <div className="rectangle" style={{ backgroundColor: couleur }}>
      {task && association && (  // Afficher la case à cocher seulement si l'élément est associé
        <input
          type="checkbox"
          checked={checked}
          onChange={handleEstFaitChange}
          className="checkbox"
        />
      )}
      <div className="text-content">
        {date && <p className="date_rect">{date}</p>}
        <h2>{textGras}</h2>
        <p className="petit_text">{textPetit}</p>
        
        {!associe && !association && (
          <div className="checkbox-button" onClick={handleCheckboxChange}>
            {typeE === "Event" ? "Je m'inscris" : 
            typeE === "Task" ? "Je m'y colle" :
            typeE === "Objet" ? "Je reserve" : "Default"}
          </div>
        )}
        
        {associe && association && (
          <div className="checkbox-button_2" onClick={handleCheckboxChange2}>
            {"Je me désiste"}
          </div>
        )}
      </div>
    </div>
  );
}



export function RectangleAjout ({ texte, couleur, eventOnClic }) {
  return (
    <div className="bouton_ajout" style={{ backgroundColor: couleur }} onClick={eventOnClic}>
        <h2>{texte}</h2>
    </div>
  );
};


export function BoutonSwipe({ nom1, nom2, pageBouton, setChangeBouton }) {
  const [active, setActive] = useState(pageBouton);

  useEffect(() => {
    setActive(pageBouton);
  }, [pageBouton]);

  const handleClick = (value) => {
    setActive(value); // Met à jour l'état local
    setChangeBouton(value); // Appelle la fonction passée en prop
  };

  return (
    <div className="encadre_boutons">
      <div
        className={`bouton_int ${active === nom1 ? "active" : ""}`}
        onClick={() => handleClick(nom1)}
      >
        {nom1}
      </div>
      <div className="sep">|</div>
      <div
        className={`bouton_int ${active === nom2 ? "active" : ""}`}
        onClick={() => handleClick(nom2)}
      >
        {nom2}
      </div>
    </div>
  );
}




