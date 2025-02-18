import React, { useState } from "react";
import './Connexion.css'; // Importer les styles CSS

function Connexion() {
  const [pseudo, setPseudo] = useState(""); // État pour le pseudo
  const [motDePasse, setMotDePasse] = useState(""); // État pour le mot de passe
  const [erreur, setErreur] = useState(""); // État pour gérer l'erreur

  // Gérer l'envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = {
      pseudo: pseudo,
      motDePasse: motDePasse,
    };

    try {
      const response = await fetch("http://localhost:5222/api/personne/login", {
        method: "POST", // Requête POST pour l'authentification
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Identifiants incorrects.");
      }

      const data = await response.json();

      // Si la connexion réussie, stocker le token JWT dans localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("Connexion réussie !");
        // Rediriger vers une autre page (par exemple, un dashboard)
        window.location.href = "/"; // Change en fonction de ta logique de redirection
      }
    } catch (error) {
      setErreur(error.message); // Afficher un message d'erreur
    }
  };

  return (
    <div className="connexion-container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="pseudo">Pseudo :</label>
          <input
            type="text"
            id="pseudo"
            name="pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="motDePasse">Mot de passe :</label>
          <input
            type="password"
            id="motDePasse"
            name="motDePasse"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>
        {erreur && <p className="error-message">{erreur}</p>}
        <div>
          <button type="submit">Se connecter</button>
        </div>
      </form>
    </div>
  );
}

export default Connexion;
