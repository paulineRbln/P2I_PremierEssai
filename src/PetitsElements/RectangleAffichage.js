import React, { useState } from 'react';
import './RectangleAffichage.css'; // Importer le fichier CSS

export function RectangleAffichage ({ textGras, textPetit, couleur, task, date }) {
  // État pour gérer la case à cocher (lue ou non)
  const [checked, setChecked] = useState(false);

  // Fonction pour gérer l'état de la case à cocher
  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  return (
    <div className="rectangle" style={{ backgroundColor: couleur }}>
      {task && (
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
      </div>
    </div>
  );
};


export function RectangleAjout ({ texte, couleur, eventOnClic }) {
  return (
    <div className="bouton_ajout" style={{ backgroundColor: couleur }} onClick={eventOnClic}>
        <h2>{texte}</h2>
    </div>
  );
};

export default {RectangleAffichage, RectangleAjout};
