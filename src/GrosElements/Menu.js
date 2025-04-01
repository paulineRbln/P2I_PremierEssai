import React from 'react';
import { FaHome, FaCalendarAlt, FaUser } from 'react-icons/fa'; // Ajouter des icônes
import { MdDashboard, MdOutlineTaskAlt } from "react-icons/md";
import BoutonMenu from '../Boutons/BoutonMenu'; // Importer le composant BoutonMenu
import './Menu.css';

const Menu = () => {
  const estProprio = localStorage.getItem("estProprio") === "true"; // Vérifier si l'utilisateur est propriétaire

  return (
    <div className="menu">
      
      <BoutonMenu 
        icon={<FaUser />} 
        text="Profil" 
        lien="/profil" 
      />

      {/* Bouton vers la page News */}
      {!estProprio && <BoutonMenu 
        icon={<MdOutlineTaskAlt  />} 
        text="Events" 
        lien="/events" 
      />}

      {!estProprio && <BoutonMenu 
        icon={<FaCalendarAlt />} 
        text="Calendrier" 
        lien="/calendrier" 
      />}
      

      {/* Bouton vers la page Profil */}
      {!estProprio && <BoutonMenu 
        icon={<FaHome />} 
        text="Maison" 
        lien="/maison" 
      />}

      {!estProprio && <BoutonMenu 
        icon={<MdDashboard />} 
        text="Accueil" 
        lien="/" 
      />}

      {estProprio && <BoutonMenu 
        icon={<MdDashboard />} 
        text="Accueil" 
        lien="/proprietaire" 
      />}

      
    </div>
  );
};

export default Menu;
