import React, { useState, useEffect } from 'react';
import { Notif, NotifNews } from '../GrosElements/Notif'; // Composant générique pour afficher les notifications
import './PageAccueil.css'; // Importer le fichier CSS
import { useNavigate } from 'react-router-dom'; // pour rediriger l'utilisateur

function PageAccueil({ setAuth }) {
  const [tachesAFaire, setTachesAFaire] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    
    // Mettre à jour l'état d'authentification
    setAuth(false);
    
    // Rediriger vers la page de connexion
    navigate('/connexion');
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
