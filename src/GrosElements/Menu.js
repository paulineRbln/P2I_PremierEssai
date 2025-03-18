import React from 'react';
import { FaHome, FaCalendarAlt, FaUser } from 'react-icons/fa'; // Ajouter des icônes
import { MdDashboard, MdOutlineTaskAlt } from "react-icons/md";
import BoutonMenu from '../Boutons/BoutonMenu'; // Importer le composant BoutonMenu
import './Menu.css';

const Menu = () => {
  return (
    <div className="menu">
      
      <BoutonMenu 
        icon={<FaUser />} 
        text="Profil" 
        lien="/profil" 
      />

      {/* Bouton vers la page News */}
      <BoutonMenu 
        icon={<MdOutlineTaskAlt  />} 
        text="Events" 
        lien="/events" 
      />

      <BoutonMenu 
        icon={<FaCalendarAlt />} 
        text="Calendrier" 
        lien="/calendrier" 
      />
      

      {/* Bouton vers la page Profil */}
      <BoutonMenu 
        icon={<FaHome />} 
        text="Maison" 
        lien="/maison" 
      />

      <BoutonMenu 
        icon={<MdDashboard />} 
        text="Accueil" 
        lien="/" 
      />

      
    </div>
  );
};

export default Menu;
