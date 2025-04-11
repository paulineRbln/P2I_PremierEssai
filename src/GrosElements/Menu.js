import React from 'react';
import { FaHome, FaCalendarAlt, FaUser } from 'react-icons/fa'; // Ajouter des icônes
import { MdDashboard, MdOutlineTaskAlt } from "react-icons/md";
import BoutonMenu from '../Boutons/BoutonMenu'; // Importer le composant BoutonMenu
import { useLocation } from 'react-router-dom'; // Importer useLocation
import './Menu.css';

/*
  Ce fichier contient le composant `Menu` qui gère l'affichage du menu de navigation.
  Ce menu est dynamique et s'adapte en fonction du rôle de l'utilisateur (propriétaire ou non).
  Les fonctionnalités principales sont :
  - Affichage des boutons de menu : Chaque bouton permet de naviguer vers une page spécifique (profil, événements, calendrier, maison, etc.).
  - Gestion conditionnelle : Selon si l'utilisateur est propriétaire ou non, certains boutons sont affichés ou non.
  - Utilisation d'icônes : Chaque bouton est accompagné d'une icône correspondante pour une meilleure expérience utilisateur.
*/

const Menu = () => {
  const location = useLocation(); // Utiliser useLocation pour obtenir l'URL actuelle
  const estProprio = localStorage.getItem("estProprio") === "true"; // Vérifie si l'utilisateur est propriétaire

  // Fonction pour vérifier si le lien actuel correspond à la page active
  const isActive = (lien) => location.pathname === lien ? 'active' : ''; // Retourne la classe 'active' si le lien correspond à l'URL actuelle

  return (
    <div className="menu">
      {/* Bouton vers la page Profil */}
      <BoutonMenu 
        icon={<FaUser />} 
        text="Profil" 
        lien="/profil" 
        color={isActive('/profil') ? '#EBACAC' : '#C5C7CC'} // Applique le rose si actif, sinon gris
      />

      {/* Affichage conditionnel des boutons selon le rôle de l'utilisateur */}
      {/* Bouton vers la page Events, visible uniquement si l'utilisateur n'est pas propriétaire */}
      {!estProprio && <BoutonMenu 
        icon={<MdOutlineTaskAlt />} 
        text="Events" 
        lien="/events" 
        color={isActive('/events') ? '#EBACAC' : '#C5C7CC'} 
      />}

      {/* Bouton vers la page Calendrier, visible uniquement si l'utilisateur n'est pas propriétaire */}
      {!estProprio && <BoutonMenu 
        icon={<FaCalendarAlt />} 
        text="Calendrier" 
        lien="/calendrier" 
        color={isActive('/calendrier') ? '#EBACAC' : '#C5C7CC'} 
      />}

      {/* Bouton vers la page Maison, visible uniquement si l'utilisateur n'est pas propriétaire */}
      {!estProprio && <BoutonMenu 
        icon={<FaHome />} 
        text="Maison" 
        lien="/maison" 
        color={isActive('/maison') ? '#EBACAC' : '#C5C7CC'} 
      />}

      {/* Bouton vers la page Accueil, visible uniquement si l'utilisateur n'est pas propriétaire */}
      {!estProprio && <BoutonMenu 
        icon={<MdDashboard />} 
        text="Accueil" 
        lien="/" 
        color={isActive('/') ? '#EBACAC' : '#C5C7CC'} 
      />}

      {/* Bouton vers la page Accueil du propriétaire, visible uniquement si l'utilisateur est propriétaire */}
      {estProprio && <BoutonMenu 
        icon={<MdDashboard />} 
        text="Accueil" 
        lien="/proprietaire" 
        color={isActive('/proprietaire') ? '#EBACAC' : '#C5C7CC'} 
      />}
    </div>
  );
};

export default Menu;
