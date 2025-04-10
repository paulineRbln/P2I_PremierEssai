import React, { useState, useEffect } from 'react';
import './RectangleAffichage.css'; // Importer le fichier CSS
import { FormulaireSuppression , FormulaireChoixDate} from '../GrosElements/Notif';
import { lienAPIMachine } from '../LienAPI/lienAPI';
import { useNavigate } from "react-router-dom";  // Pour la navigation

export function RectangleAffichage({
  textGras,
  textPetit,
  couleur,
  task,
  estFait,
  date,
  association,
  typeE,
  personneId,
  elementId,
  isNotifNews,
  pasDeBouton,
  refresh
}) {
  const [checked, setChecked] = useState(estFait);
  const [associe, setAssocie] = useState(association);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const navigate = useNavigate();  // Pour rediriger l'utilisateur
  const [showDateForm, setShowDateForm] = useState(false); // Afficher ou non le formulaire de date

  const handleJeMyColleClick = () => {
    if (typeE === "Task") {
      setShowDateForm(true); // Afficher le formulaire de date uniquement pour les tâches
    } else {
      handleCheckboxChange(); // Pour les événements, on appelle directement la fonction qui enregistre avec la date d'aujourd'hui
    }
  };
  
  const handleDateSelectionnee = (date) => {
    handleCheckboxChangeWithDate(date); // Créer l'association avec cette date
    setShowDateForm(false); // Fermer le formulaire après sélection
  };

  const handleCheckboxChangeWithDate = (date) => {
    const typeAssociation ="Attribution";
  
    const dateToSend = date; // Utiliser la date d'aujourd'hui pour les événements
  
    fetch(`${lienAPIMachine()}/association`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personneId,
        elementId,
        type: typeAssociation,
        date: dateToSend, // Envoie la date sélectionnée ou la date d'aujourd'hui
      }),
    })
      .then((response) => {
        if (response.ok) {
          setAssocie(true);
          refresh((prev) => !prev);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la création de l'association:", error);
      });
  };

  // Fonction pour gérer l'ajout de l'association
  const handleCheckboxChange = () => {
    const typeAssociation =
      typeE === "Event" ? "Inscription" :
      "Reservation";

    fetch(`${lienAPIMachine()}/association`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personneId,
        elementId,
        type: typeAssociation,
        date: new Date().toISOString().split("T")[0],
      }),
    })
      .then((response) => {
        if (response.ok) {
          setAssocie(true);
          refresh((prev) => !prev);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la création de l'association:", error);
      });
  };

  // Fonction pour vérifier si l'utilisateur est inscrit à l'événement
  const checkIfUserIsInscribed = (eventId) => {
    fetch(`${lienAPIMachine()}/element/${eventId}/inscrits`)
      .then(response => response.json())
      .then(data => {
        // Vérifier si l'utilisateur est dans la liste des inscrits
        const isUserInscribed = data.some((inscrit) => {
          return String(inscrit.id) === String(personneId);
        });
        
        if (typeE === "Event" && isUserInscribed) {
          navigate(`/infosEvent/${eventId}`);  // Rediriger vers la page de l'événement
        } else {
          openSuppressionForm(eventId);  // Ouvrir le formulaire de suppression si non inscrit
        }
      })
      .catch((error) => {
        console.error("Erreur de connexion:", error);
      });
  };

  // Fonction pour afficher le formulaire de suppression
  const openSuppressionForm = (eventId) => {
    setShowDeleteForm(true);  // Afficher le formulaire de suppression
  };

  // Fonction pour gérer la suppression de l'association
  const handleCheckboxChange2 = (asso) => {
    if (!asso && !elementId) {
      console.error("Impossible de supprimer : ni asso ni elementId ne sont définis.");
      return;
    }

    if (asso) {
      fetch(`${lienAPIMachine()}/association/${asso}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            setAssocie(false);
            refresh((prev) => !prev);
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression de l'association:", error);
        });
    } else {
      fetch(`${lienAPIMachine()}/association/personne/${personneId}/element/${elementId}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data || data.length === 0) return;

          const associationId = Array.isArray(data) ? data[0]?.id : data.id;
          if (!associationId) return;

          fetch(`${lienAPIMachine()}/association/${associationId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          })
            .then((response) => {
              if (response.ok) {
                setAssocie(false);
                refresh((prev) => !prev);
              }
            })
            .catch((error) => {
              console.error("Erreur lors de la suppression de l'association:", error);
            });
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération de l'ID de l'association:", error);
        });
    }
  };

  // Fonction pour cocher/décocher une tâche et mettre à jour l'état dans la base de données
  const handleEstFaitChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    fetch(`${lienAPIMachine()}/element/${elementId}/${newChecked}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          refresh((prev) => !prev);
        } else {
          console.error("Erreur lors de la mise à jour de estFait.");
          setChecked(checked);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de estFait:", error);
        setChecked(checked);
      });
  };

  // Fonction de gestion du clic sur le texte
  const handleDeleteClick = () => {
    if (typeE === "Event") {
      checkIfUserIsInscribed(elementId);  // Vérifier si l'utilisateur est inscrit
    } else {
      openSuppressionForm(elementId);  // Ouvrir le formulaire si ce n'est pas un événement
    }
  };

  // Fonction pour marquer une notification comme résolue
  const handleResolveClick = () => {
    fetch(`${lienAPIMachine()}/element/${elementId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          refresh((prev) => !prev); // Rafraîchir la liste des notifications
        } else {
          console.error("Erreur lors de la suppression de la notification.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression:", error);
      });
  };

  return (
    <div className="rectangle" style={{ backgroundColor: couleur }}>
      <div className="contener_check">
        {task && association && (
          <input
            type="checkbox"
            checked={checked}
            onChange={handleEstFaitChange}
            className="checkbox"
          />
        )}
        <div className="text-content" onClick={isNotifNews ? null : handleDeleteClick}>
          {date && <p className="date_rect">{date}</p>}
          <h2>{textGras}</h2>
          <p className="petit_text">{textPetit}</p>
        </div>
      </div>

      {!associe && !association && !isNotifNews && (
        <div className="checkbox-button" onClick={handleJeMyColleClick}>
        {typeE === "Event"
          ? "Je m'inscris"
          : typeE === "Task"
          ? "Je m'y colle"
          : "Réserver"}
        </div>
      )}

      {typeE === "Task" && showDateForm && (
        <FormulaireChoixDate
          setDateSelectionnee={handleDateSelectionnee}
          closeForm={() => setShowDateForm(false)}
          elementId={elementId}
        />
      )}

      {association && !isNotifNews && (
        <div
          className="checkbox-button_2"
          onClick={() => handleCheckboxChange2(typeE === "Reservation" ? elementId : null)}
        >
          {typeE === "Reservation" ? "Annuler" : "Je me désiste"}
        </div>
      )}

      {/* Bouton "Résolu" uniquement si typeE est "Notif" */}
      {typeE === "Notif"  && !pasDeBouton &&  (
        <button className="checkbox-button_2" onClick={handleResolveClick}>
          Résolu
        </button>
      )}

      {showDeleteForm && (
        <FormulaireSuppression
          elementId={elementId}
          closeForm={() => setShowDeleteForm(false)}
          refresh={refresh}
          event={typeE === "Event"}
        />
      )}
    </div>
  );
}


export function RectangleAjout({ texte, couleur, eventOnClic, couleurTxt }) {
  return (
    <div 
      className="bouton_ajout" 
      style={{ backgroundColor: couleur, color: couleurTxt ? couleurTxt : "white" }} 
      onClick={eventOnClic}
    >
      <h2>{texte}</h2>
    </div>
  );
};

export function BoutonSwipe({ nom1, nom2, pageBouton, setChangeBouton }) {
  const [active, setActive] = useState(pageBouton);

  useEffect(() => {
    setActive(pageBouton);
  }, [pageBouton]);

  const handleClick = (value) => {
    setActive(value); // Met à jour l'état local
    setChangeBouton(value); // Appelle la fonction passée en prop
  };

  return (
    <div className="encadre_boutons">
      <div
        className={`bouton_int ${active === nom1 ? "active" : ""}`}
        onClick={() => handleClick(nom1)}
      >
        {nom1}
      </div>
      <div className="sep">|</div>
      <div
        className={`bouton_int ${active === nom2 ? "active" : ""}`}
        onClick={() => handleClick(nom2)}
      >
        {nom2}
      </div>
    </div>
  );
}

export function DescriptionEvent({ date, description, listeInscrits }) {
  return (
    <div className="description_event">
      <h3>{date}</h3>
      <p>{description}</p>
      <div className="inscrits-list">
        <h4>Liste des inscrits :</h4>
        {listeInscrits.length > 0 ? (
          <ul>
            {listeInscrits.map((inscrit) => (
              <li key={inscrit.id}>{inscrit.prenom}</li> // Affiche uniquement le prénom de l'inscrit
            ))}
          </ul>
        ) : (
          <p>Aucun inscrit pour cet événement.</p>
        )}
      </div>
    </div>
  );
}