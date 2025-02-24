import React, { useState, useEffect } from 'react';
import './RectangleAffichage.css'; // Importer le fichier CSS


export function RectangleAffichage({ textGras, textPetit, couleur, task, estFait, date, association, typeE, personneId }) {
  // État pour gérer la case à cocher (lue ou non)
  const [checked, setChecked] = useState(estFait); // Initialiser avec l'association

  // Fonction pour gérer la case à cocher
  const handleCheckboxChange = () => {
    setChecked(!checked);

    // Déterminer le type d'association à créer : inscription pour événement, attribution pour tâche
    const typeAssociation = 
    typeE === "Event" ? "Inscription" :
    typeE === "Task" ? "Attribution" :
    typeE === "Objet" ? "Reservation" :
    "Default";

    fetch('/api/association', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PersonneId: personneId,
        ElementId: association.ElementId,  // Assurer que ElementId existe dans l'association
        Type: typeAssociation,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error('Échec de la création de l\'association');
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la création de l\'association', error);
      });
  };

  return (
    <div className="rectangle" style={{ backgroundColor: couleur }}>
      {task && association && (  // Afficher la case à cocher seulement si l'élément n'est pas associé
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckboxChange}
          className="checkbox"
        />
      )}
      <div className="text-content">
        {date && <p className="date_rect">{date}</p>}
        <h2>{textGras}</h2>
        <p className="petit_text">{textPetit}</p>
        {!association && (
          <button onClick={handleCheckboxChange}>
            {task ? "Je m'y colle" : "Je m'inscris"}
          </button>
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




