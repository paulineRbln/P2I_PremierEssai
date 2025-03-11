import React, { useState, useEffect } from "react";
import "./Maison.css";
import { ChoixObjet, NotifNews, Notif, FormulaireAjoutElement } from "../GrosElements/Notif";
import { BoutonSwipe } from "../PetitsElements/RectangleAffichage";

function Maison() {
  const [popupType, setPopupType] = useState(null);
  const[addObjet, setAddObjet] = useState(null);
  const [personneId, setPersonneId] = useState(null);
  const [objets, setObjets] = useState([]);
  const [choixObjet, setChoixObjet] = useState(null);
  const [resas, setResas] = useState([]);
  const [pageBouton, setPageBouton] = useState("Mes réservations"); // Défaut : voir les réservations des autres
  const[refresh, setRefresh] = useState(false);

  
  useEffect(() => {
    const id = localStorage.getItem("personneId");
    if (id) {
      setPersonneId(parseInt(id, 10)); // Convertir en nombre
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:5222/api/element")
      .then((response) => response.json())
      .then((data) => {
        setObjets(data.filter((item) => item.type === "Objet"));
      })
      .catch((error) => console.error("Erreur lors de la récupération des objets:", error));
  }, [refresh]);

  useEffect(() => {
    fetch("http://localhost:5222/api/association/news/reservations")
      .then((response) => response.json())
      .then((data) => {
        setResas(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des associations:", error));
  }, [pageBouton, popupType, refresh]);

  const handleObjetClick = (objet) => {
    setChoixObjet(objet);
    setPopupType(true);
  };

  const mesResas = resas.filter((resa) => resa.personneId === personneId);
  const autresResas = resas.filter((resa) => resa.personneId !== personneId);


  return (
    <div className="page_objets" style={{ backgroundColor: "white", minHeight: "100vh", textAlign: "center" }}>
      <h1>Appareils et salles</h1>

      <ChoixObjet listeObjets={objets} eventOnClic={handleObjetClick} addObjet={setAddObjet} />

      {popupType && choixObjet && (
        <FormulaireAjoutElement
          closePopup={() => setPopupType(false)}
          personneId={personneId}
          type="Mes réservations"
          objetId={choixObjet.id}
          reservations={resas}
          setBouton={setPageBouton} // Passer setPageBouton pour changer d'affichage après réservation
          refresh= {setRefresh}
          supression={true}
          descriptionDonnee={choixObjet.description}
        />
      )}

      {addObjet && (
        <FormulaireAjoutElement
          closePopup={() => setAddObjet(false)}
          personneId={personneId}
          type="Objet"
          refresh= {setRefresh}
        />
      )}

      <BoutonSwipe
        nom1="Mes réservations"
        nom2="Autres réservations"
        pageBouton={pageBouton}
        setChangeBouton={setPageBouton}
      />

      {pageBouton === "Autres réservations" && (
        <NotifNews titre="Réservations des autres" notifications={autresResas} couleur="#FFCCBC" resa={true} />
      )}

      {pageBouton === "Mes réservations" && (
        <Notif titre="Mes réservations" notifications={mesResas} couleur="#E8F5E9" resa ={true} refresh={setRefresh}/>
      )}
    </div>
  );
}

export default Maison;
