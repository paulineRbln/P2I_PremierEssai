import React, {useState, useEffect} from 'react';
import { RectangleAjout, RectangleAffichage } from '../PetitsElements/RectangleAffichage';
import './Notif.css'; // Si tu as des styles supplémentaires
import {FaTimes} from  'react-icons/fa';


export function Notif({ titre, notifications, couleur, task }) {
  const personneId = localStorage.getItem("personneId");  // Récupérer l'ID de la personne connectée
  const [elementsAssocies, setElementsAssocies] = useState([]);  // Liste des éléments associés à la personne

  // Utiliser useEffect pour récupérer les éléments associés dès que le composant est monté
  useEffect(() => {
    const fetchElementsAssocies = () => {
      fetch(`http://localhost:5222/api/element/personne/${personneId}`)
        .then((response) => response.json())
        .then((data) => setElementsAssocies(data))  // Mettre à jour l'état avec la liste des éléments associés
        .catch((error) => console.error('Erreur lors de la récupération des éléments associés', error));
    };
    fetchElementsAssocies(); 
  }, [personneId,elementsAssocies]);


  // Vérifier si un élément de la notification est dans la liste des éléments associés
  const checkElementAssocie = (elementId) => {
    return elementsAssocies.some((element) => element.id === elementId); // Vérifier si l'élément est dans la liste des associés
  };

  // Vérifier si la liste notifications est null ou vide
  if (notifications === null || notifications.length === 0) {
    return (
      <div className="notif">
        <h3>{titre}</h3>
        <p>Aucune notification disponible.</p>
      </div>
    );
  }

  return (
    <div className="notif">
      <h3>{titre}</h3>

      {notifications.map((notif) => {
        // Vérifier si cet élément est associé à la personne
        const isAssocie = checkElementAssocie(notif.id);

        return (
          <RectangleAffichage
            key={notif.id}
            textGras={notif.nom}
            textPetit={notif.description}
            couleur={couleur}
            task={task}
            date={notif.date}
            estFait={notif.estFait}
            association={isAssocie} 
            typeE={notif.type}
            personneId={personneId}
            elementId={notif.id}
            isNotifNews={false}
          />

        );
      })}
    </div>
  );
}




export function NotifNews({ titre, notifications, couleur, resa }) {
  // Vérifier si la liste notifications est null ou vide
  if (notifications === null || notifications.length === 0) {
    return (
      <div className="notif">
        <h3>{titre}</h3>
        <p>Aucune news disponible.</p>
      </div>
    );
  }

  return (
    <div className="notif">
      <h3>{titre}</h3>
      {notifications.map((notif, index) => (
        <RectangleAffichage
          key={index}
          textGras={resa ? notif.element : notif.titre} // Utilisation du titre du DTO
          textPetit={notif.description} // Utilisation de la description du DTO
          couleur={couleur} // Passer la couleur
          association={true}
          isNotifNews={true} // C'est une NotifNews
        />
      ))}
    </div>
  );
}

export function ChoixActions({choix1, choix2, titre, eventOnClic1, eventOnClic2 }) {
  
  return (
    <div className="choix_actions">
      <h2 className='titre'>{titre}</h2>
      <div className='bloc_rectangles'>
        <RectangleAjout texte={choix1} couleur={"#1A237E"} eventOnClic={eventOnClic1}/>
        <RectangleAjout texte={choix2} couleur={"#1A237E"} eventOnClic={eventOnClic2}/>
      </div>
    </div>
  );
}

export function ChoixObjet({ listeObjets, eventOnClic }) {
  return (
    <div className="choix_actions">
      <div className='bloc_rectangles_objet'>
        {listeObjets.map((objet, index) => (
          <RectangleAjout 
            key={index} 
            texte={objet.nom}  // Le nom de l'objet comme texte
            couleur={"#1A237E"}  // La couleur des rectangles (fixée à un bleu ici)
            eventOnClic={() => eventOnClic(objet.id)}  // Passer l'objet au clic
          />
        ))}
      </div>
    </div>
  );
}



export function FormulaireAjoutElement({ closePopup, personneId, type, setBouton }) {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Créer l'élément (événement ou tâche)
    const nouvelElement = {
      id: 0, // Géré par la BDD
      nom,
      description,
      type : type === "Evenements" ? "Event" : "Task", // "Evenements" ou "Tâches"
      estFait: false, // Par défaut, l'élément n'est pas "fait"
      date: type === "Evenements" ? date : "", // La date est utilisée uniquement pour les événements
    };

    try {
      // 1. Créer l'élément (événement ou tâche)
      const response = await fetch("http://localhost:5222/api/element", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouvelElement),
      });

      if (response.ok) {
        const elementData = await response.json(); // Récupérer les données de l'élément créé

        // 2. Créer l'association en fonction du type
        let association = {
          personneId,
          elementId: elementData.id,
          type: type === "Evenements" ? "Inscription" : "Attribution",
          date: "",
        };

        // Envoi de la requête pour créer l'association
        const associationResponse = await fetch("http://localhost:5222/api/association", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(association),
        });

        if (!associationResponse.ok) {
          alert("Erreur lors de l'inscription ou de l'attribution");
        } else {
          closePopup(); // Fermer la popup
          setBouton(type); // Mettre à jour la liste affichée
        }
      } else {
        alert("Erreur lors de l'ajout de l'élément");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur s'est produite");
    }
  };

  return (
    <div className="modal-overlay" onClick={closePopup}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="connexion-container">
          <form onSubmit={handleSubmit}>
            <div>
              <h3>Nouve{type === "Evenements" ? "l événement" : "lle tâche"}</h3>
              <input
                type="text"
                className="encadre"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
            <div>
              <h3>Infos supplémentaires</h3>
              <textarea
                className="encadre"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            {type === "Evenements" && (
              <div>
                <h3>Date de l'événement</h3>
                <input
                  type="date"
                  className="encadre"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            )}
            
            <button className="connecter" type="submit">
              Ajouter
            </button>

            {type === "Tâches" && (
              <button className="connecter_bis" type="button" onClick={handleSubmit}>
                J'ajoute et je m'y colle
              </button>
            )}
          </form>

          <button className="btn-fermer" type="button" onClick={closePopup}>
            <FaTimes className="close-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
