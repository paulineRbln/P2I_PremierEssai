using System.Text.RegularExpressions;
using tktech_bdd.Dto;

namespace tktech_bdd.Model
{
    public class Personne
    {
        public int Id { get; set; }
        public string Nom { get; set; } = null!;
        public string Prenom { get; set; } = null!;
        public string Pseudo { get; set; } = null!;
        public string PhotoProfil { get; set; } = null!;
        private string _motDePasse = null!;
        public string MotDePasse
        {
            get { return _motDePasse; }
            set
            {
                if (value.Length < 8)
                    throw new ArgumentException("Le mot de passe doit contenir au moins 8 caractères.");
                _motDePasse = value;
            }
        }
        public bool EstProprio { get; set; }

        // Constructeur normal
        public Personne() { }

        // Constructeur qui prend un PersonneDTO
        public Personne(PersonneDTO personneDTO)
        {
            Id = personneDTO.Id;
            Nom = personneDTO.Nom;
            Prenom = personneDTO.Prenom;
            Pseudo = personneDTO.Pseudo;
            PhotoProfil = personneDTO.PhotoProfil;
        }
    }
}
