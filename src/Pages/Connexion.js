import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { lienAPIMachine } from "../LienAPI/lienAPI"; // Importer la fonction lienAPIMachine
import "./Connexion.css"; // Importation du style

/*
  Ce fichier contient les composants de la page de connexion et d'inscription.
  - Le composant "Connexion" permet aux utilisateurs de se connecter en utilisant un pseudo et un mot de passe.
  - Le composant "Inscription" permet aux utilisateurs de créer un nouveau compte avec un nom, prénom, pseudo, mot de passe, et un choix de statut (propriétaire ou non).
  Les fonctionnalités principales sont :
  - Connexion : Vérification des identifiants de l'utilisateur et redirection vers la page d'accueil en cas de succès.
  - Inscription : Création d'un nouvel utilisateur avec les informations fournies, suivi d'une redirection vers la page de connexion.
*/


// Composant Connexion
function Connexion() {
  const [pseudo, setPseudo] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  console.log(localStorage.getItem("token"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = { pseudo, motDePasse };

    try {
      const response = await fetch(`${lienAPIMachine()}/personne/login`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error("Identifiants incorrects.");
      
      const data = await response.json();
      localStorage.setItem("token", data.token); // Sauvegarder le token dans le localStorage
      localStorage.setItem("personneId", data.id);  // Sauvegarder l'ID de l'utilisateur
      localStorage.setItem("estProprio", data.estProprio); // Sauvegarder le statut de propriétaire
      console.log(data.estProprio);
      window.location.href = "/"; // Redirection vers la page d'accueil après connexion

    } catch (error) {
      setErreur(error.message);
    }
  };

  return (
    <div className="connexion-container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
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
            required
          />
        </div>
        {erreur && <p className="error-message">{erreur}</p>}
        <button className="connecter" type="submit">Se connecter</button>
        <p className="lien-inscription" onClick={() => navigate("/inscription")}>
          Pas encore de compte ? Inscrivez-vous
        </p>
      </form>
    </div>
  );
}

// Composant Inscription
function Inscription() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [photoProfil, setPhotoProfil] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [estProprio, setEstProprio] = useState(false);
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (motDePasse.length < 8) {
      setErreur("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    const nouvellePersonne = { id: 0, nom, prenom, pseudo, photoProfil, motDePasse, estProprio };

    try {
      const response = await fetch(`${lienAPIMachine()}/personne`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouvellePersonne),
      });

      if (!response.ok) throw new Error("Erreur lors de l'inscription.");

      navigate("/connexion"); // Rediriger vers la connexion après inscription
    } catch (error) {
      setErreur(error.message);
    }
  };

  return (
    <div className="connexion-container">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <h3>Nom</h3>
          <input type="text" className="encadre" value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div>
          <h3>Prénom</h3>
          <input type="text" className="encadre" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
        </div>
        <div>
          <h3>Pseudo</h3>
          <input type="text" className="encadre" value={pseudo} onChange={(e) => setPseudo(e.target.value)} required />
        </div>
        <div>
          <h3>Mot de passe</h3>
          <input type="password" className="encadre" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
        </div>
        <div>
          <label>
            <input type="checkbox" checked={estProprio} onChange={(e) => setEstProprio(e.target.checked)} />
            Je suis propriétaire
          </label>
        </div>
        {erreur && <p className="error-message">{erreur}</p>}
        <button className="connecter" type="submit">S'inscrire</button>
        <p className="lien-inscription" onClick={() => navigate("/connexion")}>
          Déjà un compte ? Connectez-vous
        </p>
      </form>
    </div>
  );
}

export { Connexion, Inscription };
