import React from 'react';
import { FaHome, FaCalendarAlt, FaEnvelope, FaFingerprint } from 'react-icons/fa'; // Ajouter des icônes
import BoutonMenu from './BoutonMenu'; // Importer le composant BoutonMenu
import BoutonPlus from './BoutonPlus';
import './Menu.css';

const Menu = () => {
  return (
    <div className="menu">
      {/* Bouton vers la page News */}
      <BoutonMenu 
        icon={<FaEnvelope />} 
        text="News" 
        lien="/" 
      />

      {/* Bouton vers la page Profil */}
      <BoutonMenu 
        icon={<FaHome />} 
        text="Maison" 
        lien="/profil" 
      />

      {/* Bouton vers la page Profil */}
      <BoutonPlus />

      {/* Bouton vers la page Profil */}
      <BoutonMenu 
        icon={<FaCalendarAlt />} 
        text="Calendrier" 
        lien="/profil" 
      />

      {/* Bouton vers la page Profil */}
      <BoutonMenu 
        icon={<FaFingerprint />} 
        text="Profil" 
        lien="/profil" 
      />
    </div>
  );
};

export default Menu;
