import React, { useState, useEffect } from 'react';
import './RectangleAffichage.css'; // Importer le fichier CSS

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
  isNotifNews // Ajout de prop pour gérer les NotifNews
}) {
  const [checked, setChecked] = useState(estFait);
  const [associe, setAssocie] = useState(association);

  // Fonction pour gérer l'activation de la case à cocher (ajout de l'association)
  const handleCheckboxChange = () => {
    const typeAssociation =
      typeE === "Event" ? "Inscription" :
      typeE === "Task" ? "Attribution" :
      typeE === "Objet" ? "Reservation" : "Default";

    fetch("http://localhost:5222/api/association", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personneId: personneId,
        elementId: elementId,
        type: typeAssociation,
        date: "", // Si tu veux envoyer null pour la date, laisse cette ligne
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Échec de la création de l'association");
        } else {
          setAssocie(true); // Met à jour directement l'état associe
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la création de l'association", error);
      });
  };

  // Fonction pour gérer le désistement (suppression de l'association)
  const handleCheckboxChange2 = () => {
    fetch(
      `http://localhost:5222/api/association/personne/${personneId}/element/${elementId}`
    )
      .then((response) => response.json())
      .then((data) => {
        const associationId = data.id;

        fetch(`http://localhost:5222/api/association/${associationId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              console.error("Échec de la suppression de l'association");
            } else {
              setAssocie(false); // Met à jour directement l'état associe
            }
          })
          .catch((error) => {
            console.error("Erreur lors de la suppression de l'association", error);
          });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de l'ID de l'association", error);
      });
  };

  const handleEstFaitChange = () => {
    setChecked(!checked);
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
        <div className="text-content">
          {date && <p className="date_rect">{date}</p>}
          <h2>{textGras}</h2>
          <p className="petit_text">{textPetit}</p>
        </div>
      </div>

      {/* Afficher le bouton d'inscription seulement si l'utilisateur n'est pas associé et si ce n'est pas une notification de type "NotifNews" */}
      {!associe && !association && !isNotifNews && (
        <div className="checkbox-button" onClick={handleCheckboxChange}>
          {typeE === "Event"
            ? "Je m'inscris"
            : typeE === "Task"
            ? "Je m'y colle"
            : typeE === "Objet"
            ? "Je reserve"
            : "Default"}
        </div>
      )}

      {/* Afficher le bouton de désistement seulement si l'utilisateur est associé et ce n'est pas une notification de type "NotifNews" */}
      {association && !isNotifNews && (
        <div className="checkbox-button_2" onClick={handleCheckboxChange2}>
          {"Je me désiste"}
        </div>
      )}
    </div>
  );
}


export function RectangleAjout ({ texte, couleur, eventOnClic }) {
  return (
    <div className="bouton_ajout" style={{ backgroundColor: couleur }} onClick={eventOnClic}>
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
