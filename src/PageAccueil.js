import React from 'react';
import Notif from './Notif'; // Importer le composant Notif
import './PageAccueil.css'; // Importer le fichier CSS

function PageAccueil() {
  // Liste des notifications urgentes
  const notificationsUrgentes = [
    { titre: "Alerte Urgente", message: "Une alerte importante a été déclenchée." },
    { titre: "Nouvelle notification", message: "Une nouvelle mise à jour est disponible." },
  ];

  // Liste des autres notifications
  const notificationsAutres = [
    { titre: "Lilian a réservé la cave", message: "La libérer pour 20h svp" },
    { titre: "Deuxième notif", message: "Ici le message correspondant" },
    { titre: "Lilian a réservé la cave", message: "La libérer pour 20h svp" },
    { titre: "Deuxième notif", message: "Ici le message correspondant" },
  ];

  // Liste des tâches à faire
  const tachesAFaire = [
    { titre: "Faire la vaisselle", message: "N'oublie pas de nettoyer." },
    { titre: "Ramener les poubelles", message: "S'il vous plaît, ne les oubliez pas." },
    { titre: "Nettoyer la salle de bain", message: "Rafraîchir la salle de bain." },
    { titre: "Acheter des courses", message: "Les produits frais sont nécessaires." }
  ];

  return (
    <div className="page-accueil" style={{ backgroundColor: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <h1>Bienvenue dans ta Koloc Tranquille</h1>
      
      {/* Affichage des notifications urgentes */}
      <Notif titre="URGENT" notifications={notificationsUrgentes} couleur="#FFCCBC" />

      {/* Affichage des tâches à faire avec case à cocher */}
      <Notif titre="A faire vite" notifications={tachesAFaire} couleur="#E8F5E9" task={true} />
      
      {/* Affichage des notifications autres */}
      <Notif titre="A savoir" notifications={notificationsAutres} couleur="#CFEFEC" />
    </div>
  );
}

export default PageAccueil;
