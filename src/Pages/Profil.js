// Profil.js
import React, { useState, useEffect } from 'react';
import './Profil.css'; // Importer le fichier CSS
import { NotifNews, FormulaireModifProfil } from '../GrosElements/Notif';
import { lienAPIMachine } from '../LienAPI/lienAPI'; // Importer la fonction lienAPIMachine

/*
  Ce fichier contient le composant Profil pour gérer les actions liées au profil utilisateur.
  Il permet à l'utilisateur de :
  - Voir et modifier ses informations de profil.
  - Se déconnecter de la session.
  - Supprimer son compte.
  - Afficher les notifications liées au profil.
*/

function Profil() {
    const [personneId, setPersonneId] = useState(localStorage.getItem('personneId')); 
    const [rafraichir, setRafraichir] = useState(false); 
    const [infosUtilisateur, setInfosUtilisateur] = useState(null); 
    const [afficherFormulaire, setAfficherFormulaire] = useState(false); 

    useEffect(() => {
        // Lire directement l'ID de la personne depuis le localStorage
        const id = localStorage.getItem('personneId');
        if (id) {
            setPersonneId(id); // Mise à jour de l'état avec l'ID de la personne
        }
    }, []); 

    useEffect(() => {
        // Récupérer les informations du profil de la personne via l'API
        fetch(`${lienAPIMachine()}/personne/${personneId}`) // Utilisation de lienAPIMachine
            .then(response => response.json())
            .then(data => {
                setInfosUtilisateur([{
                    titre: `${data.nom} ${data.prenom}`, // titre devient "Nom Prénom"
                    description: data.pseudo // description devient "pseudo"
                }]);
            })
            .catch(error => console.error('Erreur lors de la récupération du profil:', error));
    }, [personneId, rafraichir]); // Dépend de 'personneId' et 'rafraichir'

    const handleDeconnexion = () => { // Renommé 'handleLogout' en 'handleDeconnexion'
        // Supprimer le token du localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('personneId');
        
        // Rediriger vers la page de connexion
        window.location.href = '/connexion';
    };

    const handleModifier = () => {
        setAfficherFormulaire(true); // Afficher le formulaire de modification du profil
    };

    const handleSupprimerCompte = () => { // Renommé 'handleSupprCompte' en 'handleSupprimerCompte'
        if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
            // Appeler l'API pour supprimer le compte
            fetch(`${lienAPIMachine()}/personne/${personneId}`, { // Utilisation de lienAPIMachine
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if (response.ok) {
                    // Supprimer les informations locales et rediriger vers la page de connexion
                    localStorage.removeItem('personneId');
                    localStorage.removeItem('token');
                    window.location.href = '/connexion';
                } else {
                    alert("Erreur lors de la suppression du compte. Veuillez réessayer.");
                }
            })
            .catch(error => {
                console.error("Erreur de suppression : ", error);
                alert("Une erreur est survenue. Veuillez réessayer.");
            });
        }
    };

    return (
        <div className="page-accueil" style={{ backgroundColor: 'white', minHeight: '100vh', textAlign: 'center' }}>
            <h1>{infosUtilisateur && infosUtilisateur[0].description}</h1>
            <button onClick={handleDeconnexion} className="btn-deconnexion">
                Se déconnecter
            </button>
            <p> SCORE LABEL</p>
            {afficherFormulaire && <FormulaireModifProfil personneId={personneId} closePopup={() => setAfficherFormulaire(false)} refresh={setRafraichir}/> }
            <NotifNews titre={"A propos de vous"} notifications={infosUtilisateur} couleur={"#ffffff"} />
            <button onClick={handleModifier} className="btn-modif">
                Modifier
            </button>
            <button onClick={handleSupprimerCompte} className="btn-suppr_profil">
                Supprimer mon compte
            </button>
        </div>
    );
}

export default Profil;
