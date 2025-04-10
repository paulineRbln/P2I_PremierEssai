import React, {useState, useEffect} from 'react';
import { RectangleAjout, RectangleAffichage } from '../PetitsElements/RectangleAffichage';
import './Notif.css'; // Si tu as des styles supplémentaires
import {FaTimes} from  'react-icons/fa';
import { lienAPIMachine } from '../LienAPI/lienAPI';

export function Notif({ titre, notifications, couleur, task, resa, refresh }) {
  const personneId = localStorage.getItem("personneId");  // Récupérer l'ID de la personne connectée
  const [elementsAssocies, setElementsAssocies] = useState([]);  // Liste des éléments associés à la personne

  // Utiliser useEffect pour récupérer les éléments associés dès que le composant est monté
  useEffect(() => {
    const fetchElementsAssocies = () => {
      fetch(`${lienAPIMachine()}/element/personne/${personneId}`)
        .then((response) => response.json())
        .then((data) => setElementsAssocies(data))  // Mettre à jour l'état avec la liste des éléments associés
        .catch((error) => console.error('Erreur lors de la récupération des éléments associés', error));
    };
    fetchElementsAssocies(); 
  }, [personneId,elementsAssocies, refresh]);


  // Vérifier si un élément de la notification est dans la liste des éléments associés
  const checkElementAssocie = (elementId) => {
    return elementsAssocies.some((element) => element.id === elementId); // Vérifier si l'élément est dans la liste des associés
  };

  // Vérifier si la liste notifications est null ou vide
  if (notifications === null || notifications.length === 0) {
    return (
      <div className="notif">
        <h3>{titre}</h3>
        <p className='message_vide'>Aucune notification disponible.</p>
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
            textGras={resa ?  notif.date : notif.nom }
            textPetit={notif.description}
            couleur={couleur}
            task={task}
            date={!resa ? notif.date : ""}
            estFait={notif.estFait}
            association={resa ? true : isAssocie} 
            typeE={resa ? "Reservation" : notif.type}
            personneId={personneId}
            elementId={notif.type === "Notif" ? notif.objetId : notif.id}
            isNotifNews={false}
            refresh={refresh}
          />

        );
      })}
    </div>
  );
}



export function NotifNews({ titre, notifications, couleur, resa, refresh, pasDeBouton }) {
  // Vérifier si la liste notifications est null ou vide

  if (notifications === null || notifications.length === 0) {
    return (
      <div className="notif">
        <h3>{titre}</h3>      
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
          typeE={notif.type}
          elementId={notif.type === "Notif" ? notif.objetId : notif.id}
          refresh={refresh}
          pasDeBouton = {pasDeBouton}
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

export function ChoixObjet({ listeObjets, eventOnClic, addObjet }) {
  return (
    <div className="choix_actions">
      <div className='bloc_rectangles_objet'>
        {listeObjets.map((objet, index) => (
          <RectangleAjout 
            key={index} 
            texte={objet.nom}  // Le nom de l'objet comme texte
            couleur={"#1A237E"}  // La couleur des rectangles (fixée à un bleu ici)
            eventOnClic={() => eventOnClic(objet)}  // Passer l'objet au clic
          />
        ))}
        <RectangleAjout 
            texte={"+"}  // Le nom de l'objet comme texte
            couleur={"#f8f9fa"}  // La couleur des rectangles (fixée à un bleu ici)
            eventOnClic={addObjet}  // Passer l'objet au clic
            couleurTxt={"#1A237E"}
          />
      </div>
    </div>
  );
}

export function FormulaireAjoutElement({ closePopup, personneId, type, dateDonnee, setBouton, objetId, reservations, refresh, supression, descriptionDonnee, eventId }) {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Cela renvoie la date sous le format 'yyyy-mm-dd'
  });
  const [isProblemReported, setIsProblemReported] = useState(false); // État pour savoir si un problème est signalé
  const [notifications, setNotifications] = useState([]);
  const [refreshForm, setRefreshForm] = useState(false);

  // Fetch des notifications quand l'objetId change
  useEffect(() => {
    if (objetId) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`${lienAPIMachine()}/association/events/${objetId}/notifications`);
          if (response.ok) {
            const data = await response.json();
            setNotifications(data.sort((a, b) => b.id - a.id)); // Tri par ID décroissant
          } else {
            console.error('Erreur lors de la récupération des notifications');
          }
        } catch (error) {
          console.error('Erreur de connexion:', error);
        }
      };
      fetchNotifications();
    }
  }, [objetId, refreshForm]); // Exécuter quand objetId change

  // Gestionnaire pour signaler un problème
  const handleSignalProblem = () => {
    setIsProblemReported(true); // Affiche les champs nécessaires pour la notification
  };

  const handleDelete = async () => {
    if (!objetId) {
      alert("Impossible de supprimer : aucun objetId fourni.");
      return;
    }

    try {
      const response = await fetch(`${lienAPIMachine()}/element/${objetId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        alert("Erreur lors de la suppression de l'objet.");
      } else {
        closePopup();
        refresh((prev) => !prev);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Une erreur s'est produite.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let association = {
      personneId,
      date,
      type: "",
    };
  
    if (type === "Mes réservations" && !isProblemReported) {
      // Vérifie si une réservation existe déjà pour cet objet à cette date
      const reservationExistante = reservations.some(
        (resa) => resa.objetId === objetId && resa.date === date
      );
  
      if (reservationExistante) {
        alert("Cet objet est déjà réservé à cette date.");
        return;
      }
  
      // Création de l'association pour la réservation
      association = {
        personneId,
        elementId: objetId,
        date,
        type: "Reservation",
      };
  
      try {
        const response = await fetch(`${lienAPIMachine()}/association`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(association),
        });
  
        if (!response.ok) {
          alert("Erreur lors de la réservation");
        } else {
          closePopup();
          if (setBouton) setBouton(type);
          if (refresh) refresh((prev) => !prev);
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur s'est produite");
      }
  
      return;
    } else if (isProblemReported || type === "Notif") {
      // Création de la notification (élément de type 'Notif')
      const nouvelleNotification = {
        id: 0, // Géré par la BDD
        nom,
        description,
        type: "Notif", // Type de l'élément, ici "Notif"
        estFait: false, // Statut de la notification
        date: date, // Date de la notification
        associationAUnElement : objetId,
      };

      // Si un eventId est fourni, ajouter l'attribut AssociationAUnElement
      if (eventId) {
        nouvelleNotification.AssociationAUnElement = eventId;
      }

      try {
        // Ajout de la notification (élément) dans la base de données
        const response = await fetch(`${lienAPIMachine()}/element`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nouvelleNotification),
        });

        if (!response.ok) {
          alert("Erreur lors de l'ajout de la notification");
          return;
        }

        // Récupérer les données de la notification ajoutée
        const notificationData = await response.json();

        // Créer l'association entre la notification et la personne
        association = {
          personneId,  // La personne qui crée la notification
          elementId: notificationData.id,  // L'ID de la notification créée
          type: "EnvoiNotif",  // Type d'association entre la personne et la notification
          date: date,
        };

        // Envoi de l'association avec la notification
        const associationResponse = await fetch(`${lienAPIMachine()}/association`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(association),
        });

        if (!associationResponse.ok) {
          alert("Erreur lors de la création de l'association de la notification");
        } else {
          closePopup();
          if (setBouton) setBouton(type);
          if (refresh) refresh((prev) => !prev);
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur s'est produite");
      }

      return;
    } else {
      // Création de l'élément (événement ou tâche)
      const nouvelElement = {
        id: 0, // Géré par la BDD
        nom,
        description,
        type: type === "Evenements" ? "Event" : type === "Objet" ? "Objet" : type === "Notif" ? "Notif" : "Task",
        estFait: false,
        date: type === "Evenements" ? dateDonnee ? dateDonnee : date : "",
        associationAUnElement: eventId
      };
    
      try {
        // Ajout de l'élément (événement ou tâche) dans la base de données
        const response = await fetch(`${lienAPIMachine()}/element`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nouvelElement),
        });
    
        if (!response.ok) {
          alert("Erreur lors de l'ajout de l'élément");
          return;
        }
    
        // Récupérer les données de l'élément ajouté
        const elementData = await response.json();
    
        // Si `nonAssos` est vrai, on ne crée pas l'association
        if ( type !== "Objet" && type !== "Tâches") {
          // Mettre à jour l'association avec l'élément créé
          association = {
            ...association,
            elementId: elementData.id,
            type: type === "Evenements" ? "Inscription" : ("Tâches" ? "Attribution" : "EnvoiNotif"),
          };
    
          // Envoi de l'association après l'ajout de l'élément
          const associationResponse = await fetch(`${lienAPIMachine()}/association`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(association),
          });
    
          if (!associationResponse.ok) {
            alert("Erreur lors de la création de l'association");
            return;
          }
        }
    
        // Fermeture du popup et mise à jour des états
        closePopup();
        if (setBouton) setBouton(type);
        if (refresh) refresh((prev) => !prev);
    
      } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur s'est produite");
      }
    }    
  };

  return (
    <div className="modal-overlay" onClick={closePopup}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="connexion-container">
          {descriptionDonnee && (
            <p className="petit_text">
              {descriptionDonnee}
            </p>
          )}

          {type === "Mes réservations" && <NotifNews
            titre=""
            notifications={notifications}
            couleur="#FFCCBC"
            refresh={setRefreshForm}
          />}
  
          <form onSubmit={handleSubmit}>
            {type === "Mes réservations" && !isProblemReported ? (
              <>
                <h3>Nouvelle réservation</h3>
                <div>
                  <h3>Date de réservation</h3>
                  <input
                    type="date"
                    className="encadre"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3>{isProblemReported ? "Type de problème" : type === "Notif" ? "Titre de la notification" : `Nouvel${type==="Evenements" ? " évenement" : type==="Objet" ? " objet" : "le tâche"}`}</h3>
                  <input
                    type="text"
                    className="encadre"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                </div>
  
                <div>
                  <h3>{isProblemReported ? "Description du problème" :  type === "Notif" ? "Message" : "Description"}</h3>
                  <textarea
                    className="encadre"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
  
            <button className="connecter" type="submit">
              {isProblemReported ? "Signaler" : "Ajouter"}
            </button>
  
            {supression && !isProblemReported && (
              <button className="connecter_bis" type="button" onClick={handleDelete}>
                Supprimer
              </button>
            )}
          </form>
  
          {type === "Mes réservations" && !isProblemReported && (
            <div>
              <button
                className="btn-signal_pb"
                type="button"
                onClick={handleSignalProblem}
              >
                Signaler un problème sur l'objet
              </button>
            </div>
          )}
  
          <button className="btn-fermer" type="button" onClick={closePopup}>
            <FaTimes className="close-icon" />
          </button>
        </div>
      </div>
    </div>
  );  
}


export function FormulaireModifProfil({ closePopup, personneId, refresh }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [photoProfil, setPhotoProfil] = useState("");
  const [estProprio, setEstProprio] = useState(false); // Valeur par défaut, ajustable si nécessaire

  useEffect(() => {
    // Récupérer les informations de l'utilisateur via l'API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${lienAPIMachine()}/personne/${personneId}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données de l'utilisateur.");
        }
        const data = await response.json();
        setNom(data.nom);
        setPrenom(data.prenom);
        setPseudo(data.pseudo);
        setPhotoProfil(data.photoProfil);
      } catch (error) {
        console.error(error);
        alert("Erreur lors du chargement des données.");
      }
    };

    fetchUserData();
  }, [personneId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedData = {
      id: personneId,
      nom,
      prenom,
      pseudo,
      photoProfil,
      motDePasse,
      estProprio,
    };

    try {
      const response = await fetch(`${lienAPIMachine()}/personne/${personneId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        alert("Erreur lors de la mise à jour des données.");
      } else {
        closePopup();
        if (refresh) refresh((prev) => !prev); // Refresh si nécessaire
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur s'est produite.");
    }
  };

  return (
    <div className="modal-overlay" onClick={closePopup}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="connexion-container">
          <h3>Modifier mon profil</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <h3>Nom</h3>
              <input
                type="text"
                className="encadre"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>

            <div>
              <h3>Prénom</h3>
              <input
                type="text"
                className="encadre"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
            </div>

            <div>
              <h3>Pseudo</h3>
              <input
                type="text"
                className="encadre"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                required
              />
            </div>

            <div>
              <h3>Mot de passe</h3>
              <input
                type="password"
                className="encadre"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="Réécrire mot de passe"
                required
              />
            </div>

            <div>
              <h3>Etes-vous propriétaire ?</h3>
              <input
                type="checkbox"
                className="encadre"
                checked={estProprio}
                onChange={(e) => setEstProprio(e.target.checked)}
              />
            </div>

            <button className="connecter" type="submit">
              Enregistrer les modifications
            </button>
          </form>

          <button className="btn-fermer" type="button" onClick={closePopup}>
            <FaTimes className="close-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function FormulaireSuppression({ elementId, closeForm, refresh, event = false }) {
  const [inscrits, setInscrits] = useState([]); // Liste des inscrits
  const [loading, setLoading] = useState(false); // Gérer l'état de chargement pendant la suppression

  // Récupérer la liste des inscrits à l'événement
  useEffect(() => {
    if (event) {
      const fetchInscrits = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${lienAPIMachine()}/element/${elementId}/inscrits`);
          if (response.ok) {
            const data = await response.json();
            setInscrits(data); // Mettre à jour la liste des inscrits
          } else {
            console.error("Erreur lors de la récupération des inscrits.");
          }
        } catch (error) {
          console.error("Erreur de connexion:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchInscrits();
    }
  }, [elementId, event]);

  // Fonction pour supprimer l'élément et ses associations
  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${lienAPIMachine()}/element/${elementId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        refresh((prev) => !prev); // Rafraîchir après suppression
        closeForm(); // Fermer le formulaire de suppression
      } else {
        alert("Erreur lors de la suppression de l'élément.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur s'est produite lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="modal-overlay" onClick={closeForm}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="connexion-container">
          <h3>{event ? "" : "Supprimer l'élément ?"}</h3>

          {event && (
            <div className="inscrits-list">
              <h4>Liste des inscrits :</h4>
              {loading ? (
                <p>Chargement des inscrits...</p>
              ) : inscrits.length > 0 ? (
                <ul>
                  {inscrits.map((inscrit) => (
                    <li key={inscrit.id}>{inscrit.prenom}</li> // Affiche uniquement le prénom de l'inscrit
                  ))}
                </ul>
              ) : (
                <p>Aucun inscrit pour cet événement.</p>
              )}
            </div>
          )}

          <button
            className="connecter"
            type="button"
            onClick={handleDelete}
            disabled={loading} // Désactiver le bouton pendant le chargement
          >
            {loading ? "Suppression en cours..." : "Supprimer"}
          </button>

          <button className="btn-fermer" type="button" onClick={closeForm}>
            <FaTimes className="close-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function FormulaireChoixDate({ setDateSelectionnee, closeForm }) {
  const [date, setDate] = useState(''); // Stocke la date sélectionnée

  // Fonction pour définir la date sélectionnée et fermer le formulaire
  const handleChoisir = () => {
    setDateSelectionnee(date); // Met à jour la date sélectionnée
    closeForm(); // Ferme le formulaire
  };

  return (
    <div className="modal-overlay" onClick={closeForm}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="connexion-container">
          <h3>Quand ?</h3>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)} // Met à jour la date sélectionnée
            className="encadre"
          />
          <button
            className="connecter"
            onClick={handleChoisir}
            disabled={!date} // Désactive le bouton si aucune date n'est sélectionnée
          >
            Confirmer
          </button>

          <button className="btn-fermer" type="button" onClick={closeForm}>
            <FaTimes className="close-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
