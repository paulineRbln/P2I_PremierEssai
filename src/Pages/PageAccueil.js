import React, { useState, useEffect } from 'react';
import { Notif, NotifNews } from '../GrosElements/Notif';
import './PageAccueil.css'; // Importer le fichier CSS
import {jwtDecode} from 'jwt-decode';

function PageAccueil() {
  const [tachesAFaire, setTachesAFaire] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [news, setNews] = useState([]);
  const [personneId, setPersonneId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Token décodé:", decodedToken); // Affiche tout le contenu du token
        // Récupérer l'ID de la personne avec la clé correcte
        const personneId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        console.log("ID de la personne:", personneId); // Affiche l'ID
        setPersonneId(personneId);
      } catch (error) {
        console.error("Erreur lors du décodage du token", error);
      }
    }
  }, []);

  // Récupérer les tâches à faire de la personne
  useEffect(() => {
    if (personneId) {
      fetch(`http://localhost:5222/api/element/personne/${personneId}`)
        .then(response => response.json())
        .then(data => {
          const tachesFiltrees = data.filter(item => item.type === 'Task' && !item.estFait);
          setTachesAFaire(tachesFiltrees);
        })
        .catch(error => console.error('Erreur lors de la récupération des tâches:', error));
    }
  }, [personneId]);

  // Récupérer les événements depuis l'API
  useEffect(() => {
    fetch(`http://localhost:5222/api/element/personne/${personneId}`)
      .then(response => response.json())
      .then(data => {
        const evenementsFiltrees = data.filter(item => item.type === 'Event');
        setEvenements(evenementsFiltrees);
      })
      .catch(error => console.error('Erreur lors de la récupération des événements:', error));
  }, [personneId]);

  // Récupérer les inscriptions et les réservations depuis l'API
  useEffect(() => {
    if (personneId) {
      fetch(`http://localhost:5222/api/association/news/${personneId}`)
        .then(response => response.json())
        .then(data => {
          setNews(data);  // Mettre à jour l'état avec les données des notifications
        })
        .catch(error => console.error('Erreur lors de la récupération des news:', error));
    }
  }, [personneId]);

  const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    
    // Rediriger vers la page de connexion
    window.location.href ='/connexion';
  };

  return (
    <div className="page-accueil" style={{ backgroundColor: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <h1>Bienvenue dans ta Koloc Tranquille</h1>
      <button onClick={handleLogout} className="btn-deconnexion">
        Se déconnecter
      </button>

      {/* Affichage des tâches à faire */}
      <Notif
        titre="A faire vite"
        notifications={tachesAFaire}
        couleur="#E8F5E9"
        task={true}
      />

      {/* Affichage des événements */}
      <Notif
        titre="Vos événements à venir"
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
