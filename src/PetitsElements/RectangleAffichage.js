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
  isNotifNews,
  refresh
}) {
  const [checked, setChecked] = useState(estFait);
  const [associe, setAssocie] = useState(association);

  // Fonction pour gérer l'ajout de l'association
  const handleCheckboxChange = () => {
    const typeAssociation =
      typeE === "Event" ? "Inscription" :
      typeE === "Task" ? "Attribution" :
      "Reservation";

    fetch("http://localhost:5222/api/association", {
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

  // Fonction pour gérer la suppression de l'association
  const handleCheckboxChange2 = (asso) => {
    if (!asso && !elementId) {
      console.error("Impossible de supprimer : ni asso ni elementId ne sont définis.");
      return;
    }

    if (asso) {
      fetch(`http://localhost:5222/api/association/${asso}`, {
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
      fetch(`http://localhost:5222/api/association/personne/${personneId}/element/${elementId}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data || data.length === 0) return;

          const associationId = Array.isArray(data) ? data[0]?.id : data.id;
          if (!associationId) return;

          fetch(`http://localhost:5222/api/association/${associationId}`, {
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

  // Fonction pour cocher/décocher une tâche
  const handleEstFaitChange = () => {
    setChecked(!checked);
    refresh((prev) => !prev);
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

      {/* Bouton pour s'inscrire / s'attribuer une tâche */}
      {!associe && !association && !isNotifNews && (
        <div className="checkbox-button" onClick={handleCheckboxChange}>
          {typeE === "Event"
            ? "Je m'inscris"
            : typeE === "Task"
            ? "Je m'y colle"
            : "Réserver"}
        </div>
      )}

      {/* Bouton pour se désister / annuler une réservation */}
      {association && !isNotifNews && (
        <div
          className="checkbox-button_2"
          onClick={() => handleCheckboxChange2(typeE === "Reservation" ? elementId : null)}
        >
          {typeE === "Reservation" ? "Annuler" : "Je me désiste"}
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
