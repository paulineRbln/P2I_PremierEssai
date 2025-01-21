import React from 'react';
import { useNavigate } from 'react-router-dom'; // Utilisation de useNavigate au lieu de useHistory
import './BoutonMenu.css'; // Importer le fichier CSS

const BoutonMenu = ({ icon, text, lien }) => {
  const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation

  // Fonction pour gérer le clic et la redirection
  const handleClick = () => {
    navigate(lien); // Redirige vers le lien spécifié
  };

  return (
    <div className="menu-button" onClick={handleClick}>
      {icon && <div className="menu-icon">{icon}</div>} {/* Icône sans le div supplémentaire */}
      {text && <span>{text}</span>} 
    </div>
  );
};

export default BoutonMenu;
