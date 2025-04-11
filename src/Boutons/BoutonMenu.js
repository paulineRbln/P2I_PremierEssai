import React from 'react';
import { useNavigate } from 'react-router-dom'; // Utilisation de useNavigate au lieu de useHistory
import './BoutonMenu.css'; // Importer le fichier CSS

/*
  Ce fichier contient le composant `BoutonMenu` qui représente un bouton de menu.
  Ce composant est utilisé pour afficher un bouton avec une icône et un texte, et permet de rediriger l'utilisateur vers une page spécifique lorsqu'il est cliqué.
  Les fonctionnalités principales sont :
  - Affichage d'une icône et d'un texte : Le bouton peut contenir une icône et un texte.
  - Navigation : Lors du clic sur le bouton, l'utilisateur est redirigé vers la page spécifiée par le lien.
  - Personnalisation de la couleur : Le bouton permet de personnaliser la couleur de l'icône via une prop.
*/

const BoutonMenu = ({ icon, text, lien, color }) => {
  const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation

  // Fonction pour gérer le clic et la redirection
  const handleClick = () => {
    navigate(lien); // Redirige vers le lien spécifié
  };

  return (
    <div className="menu-button" onClick={handleClick}>
      {icon && (
        <div className="menu-icon" style={{ color: color }}>
          {icon}
        </div>
      )}
      {text && <span style={{ color: color }} >{text}</span >}
    </div>
  );
};

export default BoutonMenu;
