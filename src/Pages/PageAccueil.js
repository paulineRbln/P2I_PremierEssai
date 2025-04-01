// PageAccueil.js
import React, { useState, useEffect } from 'react';
import { Notif, NotifNews } from '../GrosElements/Notif';
import './PageAccueil.css'; // Importer le fichier CSS
import { lienAPIMachine } from '../LienAPI/lienAPI'; // Importer la fonction lienAPIMachine

function PageAccueil() {
  const [tachesAFaire, setTachesAFaire] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [news, setNews] = useState([]);
  const [personneId, setPersonneId] = useState(localStorage.getItem('personneId'));
  const [refresh, setRefresh] = useState(false);

 
  useEffect(() => {
    // Lire directement l'ID de la personne depuis le localStorage
    const id = localStorage.getItem('personneId');
    if (id) {
      setPersonneId(id);
    }
  }, []); // Ce useEffect se lance une seule fois au montage du composant
  
  // Récupérer les tâches à faire de la personne
  useEffect(() => {
    if (personneId) {
      fetch(`${lienAPIMachine()}/element/personne/${personneId}`) // Utilisation de lienAPIMachine
        .then(response => response.json())
        .then(data => {
          const tachesFiltrees = data.filter(item => item.type === 'Task' && !item.estFait);
          setTachesAFaire(tachesFiltrees);
        })
        .catch(error => console.error('Erreur lors de la récupération des tâches:', error));
    }
  }, [personneId, refresh]);

  // Récupérer les événements depuis l'API
  useEffect(() => {
    fetch(`${lienAPIMachine()}/element/personne/${personneId}`) // Utilisation de lienAPIMachine
      .then(response => response.json())
      .then(data => {
        const evenementsFiltrees = data.filter(item => item.type === 'Event');
        setEvenements(evenementsFiltrees);
      })
      .catch(error => console.error('Erreur lors de la récupération des événements:', error));
  }, [personneId]);

  // Récupérer les news du jour depuis l'API
  useEffect(() => {
    if (personneId) {
      fetch(`${lienAPIMachine()}/association/news/${personneId}`) // Utilisation de lienAPIMachine
        .then(response => response.json())
        .then(data => {
          // Récupérer la date d'aujourd'hui au format 'YYYY-MM-DD'
          const today = new Date().toISOString().split('T')[0];
          
          // Filtrer les news dont la date est celle d'aujourd'hui
          const newsJour = data.filter(news => {
            // Vérifier si la date existe et n'est pas vide
            if (news.date && news.date !== "") {
              const newsDate = new Date(news.date);
              
              // Vérifier si la date est valide
              if (!isNaN(newsDate)) {
                const formattedNewsDate = newsDate.toISOString().split('T')[0]; // Formater la date de la news en 'YYYY-MM-DD'
                return formattedNewsDate === today || news.titre === "Nouvelle réservation"; // Comparer avec la date d'aujourd'hui
              }
            }
            return false;  // Ne pas inclure cette news si la date est manquante ou invalide
          });
  
          // Mettre à jour l'état avec les news filtrées
          setNews(newsJour);
        })
        .catch(error => console.error('Erreur lors de la récupération des news:', error));
    }
  }, [personneId, refresh]);
  

  return (
    <div className="page-accueil" style={{ backgroundColor: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <h1>Bienvenue dans ta Koloc Tranquille</h1>

      {/* Affichage des tâches à faire */}
      <Notif
        titre="A faire vite"
        notifications={tachesAFaire}
        couleur="#E8F5E9"
        task={true}
        refresh={setRefresh}
      />

      {/* Affichage des événements */}
      <Notif
        titre="Vos événements à venir"
        notifications={evenements}
        couleur="#CFEFEC"
        refresh={setRefresh}
      />

      {/* Affichage des news */}
      <NotifNews
        titre="News du jour"
        notifications={news}
        couleur="#FFCCBC"
        refresh={setRefresh}
      />
    </div>
  );
}

export default PageAccueil;
