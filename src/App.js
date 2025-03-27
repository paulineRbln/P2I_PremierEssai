import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Importer React Router
import './App.css';
import PageAccueil from './Pages/PageAccueil'; // Page d'accueil
import Events from './Pages/Events'; // Votre composant Profil
import Calendrier from './Pages/Calendrier'; // Votre composant Profil
import Maison from './Pages/Maison'; // Votre composant Profil
import Menu from './GrosElements/Menu'; // Menu de navigation
import Profil from './Pages/Profil';
import InfosEvent from './Pages/InfosEvent';
import {Connexion, Inscription} from './Pages/Connexion'; // Composant de connexion

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route pour la page de connexion */}
          <Route path="/connexion" element={!localStorage.getItem("token") ? <Connexion/> : <Navigate to="/" />} />
          <Route path="/inscription" element={!localStorage.getItem("token") ? <Inscription />: <Navigate to="/" /> }/>

          {/* Routes protégées : si l'utilisateur n'est pas authentifié, redirection vers /connexion */}
          <Route path="/" element={localStorage.getItem("token") ? <PageAccueil /> : <Navigate to="/connexion" />} />
          <Route path="/calendrier" element={localStorage.getItem("token") ? <Calendrier /> : <Navigate to="/connexion" />} />
          <Route path="/events" element={localStorage.getItem("token") ? <Events /> : <Navigate to="/connexion" />} />
          <Route path="/maison" element={localStorage.getItem("token") ? <Maison /> : <Navigate to="/connexion" />} />
          <Route path="/profil" element={localStorage.getItem("token") ? <Profil /> : <Navigate to="/connexion" />} />
          <Route path="/infosEvent/:eventId" element={localStorage.getItem("token") ? <InfosEvent /> : <Navigate to="/connexion" />} />
        </Routes>

        {/* Le menu de navigation, visible sur toutes les pages après la connexion */}
        {localStorage.getItem("token") && <Menu  />}
      </div>
    </Router>
  );
}

export default App;