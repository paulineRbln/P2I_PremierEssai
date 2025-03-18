import React, { useState, useEffect } from 'react';
import './Profil.css'; // Importer le fichier CSS
import { NotifNews, FormulaireModifProfil } from '../GrosElements/Notif';

function Profil() {
    const [personneId, setPersonneId] = useState(localStorage.getItem('personneId'));
    const[refresh, setRefresh] = useState(false);
    const[infoUser, setInfoUser] = useState(null);
    const[showForm, setShowForm] = useState(false);

    useEffect(() => {
        // Lire directement l'ID de la personne depuis le localStorage
        const id = localStorage.getItem('personneId');
        if (id) {
          setPersonneId(id);
        }
      }, []); // Ce useEffect se lance une seule fois au montage du composant

    useEffect(() => {
        fetch(`http://localhost:5222/api/personne/${personneId}`)
        .then(response => response.json())
        .then(data => {
            setInfoUser([{
                titre : `${data.nom} ${data.prenom}`, // titre devient "Nom Prénom"
                description : data.pseudo // description devient "pseudo"
            }]);
        })
        .catch(error => console.error('Erreur lors de la récupération du profil:', error));
    }, [personneId, refresh]);

    const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('personneId');
    
    // Rediriger vers la page de connexion
    window.location.href ='/connexion';
    };

    const handleModifier = () => {
        setShowForm(true);
    }

    return (
        <div className="page-accueil" style={{ backgroundColor: 'white', minHeight: '100vh', textAlign: 'center' }}>
            <h1>{infoUser && infoUser[0].description}</h1>
            <button onClick={handleLogout} className="btn-deconnexion">
            Se déconnecter
            </button>
            <p> SCORE LABEL</p>
            {showForm && <FormulaireModifProfil personneId={personneId} closePopup={() => setShowForm(false)} refresh={setRefresh}/>}
            <NotifNews titre={"A propos de vous"} notifications={infoUser} couleur={"#ffffff"} />
            <button onClick={handleModifier} className="btn-modif">
            Modifier
            </button>
        </div>
    )

}
export default Profil;