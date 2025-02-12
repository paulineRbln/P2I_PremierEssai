import React from 'react';
import { FaHome, FaCalendarAlt } from 'react-icons/fa'; // Ajouter des icônes
import { MdDashboard, MdOutlineTaskAlt } from "react-icons/md";
import BoutonMenu from '../Boutons/BoutonMenu'; // Importer le composant BoutonMenu
import BoutonPlus from '../Boutons/BoutonPlus';
import './Menu.css';

const Menu = () => {
  return (
    <div className="menu">
      {/* Bouton vers la page Profil */}
      <BoutonMenu 
        icon={<MdDashboard />} 
        text="Accueil" 
        lien="/" 
      />

      {/* Bouton vers la page News */}
      <BoutonMenu 
        icon={<MdOutlineTaskAlt  />} 
        text="Events" 
        lien="/events" 
      />

      {/* Bouton vers la page Profil */}
      <BoutonPlus />

      {/* Bouton vers la page Profil */}
      <BoutonMenu 
        icon={<FaHome />} 
        text="Maison" 
        lien="/maison" 
      />

      {/* Bouton vers la page Profil */}
      <BoutonMenu 
        icon={<FaCalendarAlt />} 
        text="Calendrier" 
        lien="/calendrier" 
      />

      
    </div>
  );
};

export default Menu;
