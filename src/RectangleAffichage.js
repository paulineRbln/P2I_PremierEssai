import React, { useState } from 'react';
import './RectangleAffichage.css'; // Importer le fichier CSS

const RectangleAffichage = ({ textGras, textPetit, couleur, task }) => {
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
        <h2>{textGras}</h2>
        <p>{textPetit}</p>
      </div>
    </div>
  );
};

export default RectangleAffichage;
