import React, { useState } from 'react';
import { FaCirclePlus } from 'react-icons/fa6'; // Icône +
import './BoutonPlus.css'; // Importer le fichier CSS

const BoutonPlus = () => {
  const [isVisible, setIsVisible] = useState(false); // Pour afficher/masquer l'élément

  const handleClick = () => {
    setIsVisible(!isVisible); // Change l'état pour afficher/masquer l'élément
  };

  return (
    <div>
      <div className="plus-button" onClick={handleClick}>
      <div className="plus-icon">{<FaCirclePlus/>}</div>
      </div>
    </div>
  );
};

export default BoutonPlus;
