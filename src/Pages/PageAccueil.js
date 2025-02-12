import React, { useState, useEffect } from 'react';
import {Notif, NotifNews} from '../GrosElements/Notif'; // Composant générique pour afficher les notifications
import './PageAccueil.css'; // Importer le fichier CSS

function PageAccueil() {
  // États pour les différentes catégories de notifications
  const [tachesAFaire, setTachesAFaire] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [news, setNews] = useState([]);

  // Récupérer les tâches à faire depuis l'API
  useEffect(() => {
    fetch('http://localhost:5222/api/element')
      .then(response => response.json())
      .then(data => {
        const tachesFiltrees = data.filter(item => item.type === 'Task' && !item.estFait);
        setTachesAFaire(tachesFiltrees);
      })
      .catch(error => console.error('Erreur lors de la récupération des tâches:', error));
  }, []);

  // Récupérer les événements depuis l'API
  useEffect(() => {
    fetch('http://localhost:5222/api/element')
      .then(response => response.json())
      .then(data => {
        const evenementsFiltrees = data.filter(item => item.type === 'Event');
        setEvenements(evenementsFiltrees);
      })
      .catch(error => console.error('Erreur lors de la récupération des événements:', error));
  }, []);

  // Récupérer les inscriptions et les réservations depuis l'API
  useEffect(() => {
    fetch('http://localhost:5222/api/association')
      .then(response => response.json())
      .then(data => {
        const newsFiltrees = data.filter(item => item.type === 'Inscription' || item.type === 'Reservation');
        console.log("Données filtrées pour les notifications :", newsFiltrees); // Ajoute un log ici pour voir les données
        setNews(newsFiltrees);
      })
      .catch(error => console.error('Erreur lors de la récupération des inscriptions et réservations:', error));
  }, []);

  return (
    <div className="page-accueil" style={{ backgroundColor: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <h1>Bienvenue dans ta Koloc Tranquille</h1>

      {/* Affichage des tâches à faire */}
      <Notif
        titre="A faire vite"
        notifications={tachesAFaire}
        couleur="#E8F5E9"
        task={true}
      />

      {/* Affichage des événements */}
      <Notif
        titre="Evénements à venir"
        notifications={evenements}
        couleur="#CFEFEC"
      />

      <NotifNews
        titre="News du jour"
        notifications={news}
        couleur="#FFCCBC"
      />
    </div>
  );
}

export default PageAccueil;
