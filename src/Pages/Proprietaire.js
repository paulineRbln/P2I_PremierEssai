import React, { useState, useEffect } from "react";
import "./Proprietaire.css";
import { NotifNews } from "../GrosElements/Notif";
import { lienAPIMachine } from '../LienAPI/lienAPI';

export function Proprietaire() {
    const [personneId, setPersonneId] = useState(localStorage.getItem('personneId'));
    const [objets, setObjets] = useState([]);
  
    // Initialisation du ID de la personne
    useEffect(() => {
      const id = localStorage.getItem("personneId");
      if (id) {
        setPersonneId(parseInt(id, 10)); // Convertir en nombre
      }
    }, []);
  
    // Récupérer tous les objets (pas seulement ceux du propriétaire)
    useEffect(() => {
      fetch(`${lienAPIMachine()}/element`)
        .then((response) => response.json())
        .then((data) => {
          setObjets(data.filter((item) => item.type === "Objet"));
        })
        .catch((error) => console.error("Erreur lors de la récupération des objets :", error));
    }, []);
  
    return (
      <div className="page_proprietaire" style={{ backgroundColor: "white", minHeight: "100vh", textAlign: "center" }}>
        <h1>Gérer Votre Koloc Tranquille</h1>
  
        {objets.length === 0 ? (
          <p>Aucun objet trouvé.</p>
        ) : (
          <div>
            {objets.map((objet) => (
              <div key={objet.id}>
                <h3>{objet.nom}</h3>
                <InfosObjet objetId={objet.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  

export function InfosObjet({ objetId }) {
    const [notifications, setNotifications] = useState([]);
    const [refresh, setRefresh] = useState(false);

  
    useEffect(() => {
      if (!objetId) return; // Ne pas faire de fetch si pas d'ID
  
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`${lienAPIMachine()}/association/events/${objetId}/notifications`);
          const data = await response.json();
          setNotifications(data); // Mettre à jour les notifications
        } catch (error) {
          console.error("Erreur lors de la récupération des notifications :", error);
        }
      };
  
      fetchNotifications();
    }, [objetId, refresh]); // Refaire le fetch si l'ID change
  
    return (
      <div>
        <NotifNews
          notifications={notifications}
          couleur="#FFCCBC"
          refresh={setRefresh}
        />
      </div>
    );
  }
