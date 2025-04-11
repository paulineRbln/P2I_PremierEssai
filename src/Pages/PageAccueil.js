import React, { useState, useEffect } from 'react';
import { Notif, NotifNews } from '../GrosElements/Notif';
import './PageAccueil.css'; // Importer le fichier CSS
import { lienAPIMachine } from '../LienAPI/lienAPI'; // Importer la fonction lienAPIMachine

/*
  Ce fichier contient le composant principal pour la gestion de la page d'accueil.
  Il permet d'afficher les tâches à faire, les événements à venir, les actualités du jour et les notifications simples.
  Les fonctionnalités principales sont :
  - Affichage des tâches à faire : Permet de visualiser les tâches à accomplir par l'utilisateur.
  - Affichage des événements : Permet de voir les événements à venir.
  - Affichage des actualités : Affiche les nouvelles actualités en fonction de la date.
  - Notifications simples : Permet de récupérer et d'afficher les notifications simples.
*/
/*
  Ce fichier contient le composant principal pour la gestion de la page d'accueil.
  Il permet d'afficher les tâches à faire, les événements à venir, les actualités du jour et les notifications simples.
  Les fonctionnalités principales sont :
  - Affichage des tâches à faire : Permet de visualiser les tâches à accomplir par l'utilisateur.
  - Affichage des événements : Permet de voir les événements à venir.
  - Affichage des actualités : Affiche les nouvelles actualités en fonction de la date.
  - Notifications simples : Permet de récupérer et d'afficher les notifications simples.
*/

function PageAccueil() {
  // États internes pour gérer les différentes données
  const [tachesAFaire, setTachesAFaire] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [actualites, setActualites] = useState([]);
  const [notificationsSimples, setNotificationsSimples] = useState([]); 
  const [personneId, setPersonneId] = useState(localStorage.getItem('personneId')); // ID de la personne récupéré du localStorage
  const [rafraichir, setRafraichir] = useState(false);

  // useEffect pour récupérer l'ID de la personne à partir du localStorage et lancer la suppression des anciens éléments
  useEffect(() => {
    const id = localStorage.getItem('personneId');
    if (id) {
      setPersonneId(id);
    }

    // Fonction pour supprimer les éléments anciens automatiquement via l'API
    const supprimerAnciennesDonnees = async () => { 
      try {
        const response = await fetch(`${lienAPIMachine()}/element/deleteOld`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log('Événements, attributions et réservations passées supprimées.');
        } else {
          console.error('Erreur lors de la suppression des éléments passés');
        }
      } catch (error) {
        console.error('Erreur dans la requête de suppression :', error);
      }
    };

    supprimerAnciennesDonnees(); // Appeler la fonction de suppression
  }, []); 

  // useEffect pour récupérer les tâches à faire de la personne
  useEffect(() => {
    if (personneId) {
      fetch(`${lienAPIMachine()}/element/personne/${personneId}`)
        .then(response => response.json())
        .then(data => {
          const tachesFiltrees = data.filter(item => item.type === 'Task' && !item.estFait); // Filtrer les tâches non faites
          setTachesAFaire(tachesFiltrees);
        })
        .catch(error => console.error('Erreur lors de la récupération des tâches:', error));
    }
  }, [personneId, rafraichir]); 

  // useEffect pour récupérer les événements
  useEffect(() => {
    fetch(`${lienAPIMachine()}/element/personne/${personneId}`)
      .then(response => response.json())
      .then(data => {
        const evenementsFiltrees = data.filter(item => item.type === 'Event'); // Filtrer les événements
        setEvenements(evenementsFiltrees);
      })
      .catch(error => console.error('Erreur lors de la récupération des événements:', error));
  }, [personneId]);

  // useEffect pour récupérer les actualités du jour
  useEffect(() => {
    if (personneId) {
      fetch(`${lienAPIMachine()}/association/news/${personneId}`)
        .then(response => response.json())
        .then(data => {
          const aujourdHui = new Date().toISOString().split('T')[0]; 
          
          // Filtrer les actualités pour n'afficher que celles du jour
          const actualitesDuJour = data.filter(actualite => {
            if (actualite.date && actualite.date !== "") {
              const dateActualite = new Date(actualite.date);
              
              if (!isNaN(dateActualite)) {
                const formattedDateActualite = dateActualite.toISOString().split('T')[0];
                return formattedDateActualite === aujourdHui || actualite.titre === "Nouvelle réservation"; 
              }
            }
            return false;  
          });

          setActualites(actualitesDuJour);
        })
        .catch(error => console.error('Erreur lors de la récupération des actualités:', error));
    }
  }, [personneId, rafraichir]);

  // useEffect pour récupérer les notifications simples
  useEffect(() => {
    if (personneId) {
      fetch(`${lienAPIMachine()}/association/notifications/notifs-simple`)
        .then(response => response.json())
        .then(data => {
          setNotificationsSimples(data);
        })
        .catch(error => console.error('Erreur lors de la récupération des notifications simples:', error));
    }
  }, [personneId, rafraichir]);

  // Combinaison des actualités et notifications simples pour l'affichage
  const notificationsCombinees = [...actualites, ...notificationsSimples];

  return (
    <div className="page-accueil" style={{ backgroundColor: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <h1>Bienvenue dans ta Koloc Tranquille</h1>

      {/* Affichage des tâches à faire */}
      <Notif
        titre="A faire vite"
        notifications={tachesAFaire}
        couleur="#E8F5E9"
        task={true}
        refresh={setRafraichir}
      />

      {/* Affichage des événements */}
      <Notif
        titre="Vos événements à venir"
        notifications={evenements}
        couleur="#CFEFEC"
        refresh={setRafraichir}
      />

      {/* Affichage des news et notifications simples */}
      <NotifNews
        titre="News du jour"
        notifications={notificationsCombinees} 
        couleur="#FFCCBC"
        refresh={setRafraichir}
        pasDeBouton={true}
      />
    </div>
  );
}

export default PageAccueil;
