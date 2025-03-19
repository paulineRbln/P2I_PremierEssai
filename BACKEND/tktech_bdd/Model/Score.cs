using tktech_bdd.Dto;
namespace tktech_bdd.Model
{
    public class Score
    {
        public int Id { get; set; }
        public int PersonneId { get; set; }       
        // Les différents scores
        public int NbTaches { get; set; } // Inversi
        public int NbEvenementsCree { get; set; } // Animateur
        public int NbEvenementsParticipe { get; set; } // Festif
        public int NbReservations { get; set; } // Businessman
        public int NbProblemesAnnonces { get; set; } // Ingénieur
        public int NbElementsAchetes { get; set; } // Banque

        // Constructeur par défaut
        public Score() { 
            NbTaches =0;
            NbEvenementsCree =0; 
            NbEvenementsParticipe = 0;
            NbReservations =0;
            NbProblemesAnnonces =0;
            NbElementsAchetes =0;
         }
    }
}
