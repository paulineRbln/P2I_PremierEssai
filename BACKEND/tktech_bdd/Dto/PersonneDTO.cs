using tktech_bdd.Model;
namespace tktech_bdd.Dto
{
    public class PersonneDTO
    {
        public string Nom { get; set; } = null!;
        public string Prenom { get; set; } = null!;
        public string Pseudo { get; set; } = null!;
        public string PhotoProfil { get; set; } = null!;


        public PersonneDTO(){}
        
        // Constructeur qui initialise les propriétés à partir de l'entité Personne
        public PersonneDTO(Personne personne)
        {
            Nom = personne.Nom;
            Prenom = personne.Prenom;
            Pseudo = personne.Pseudo;
            PhotoProfil = personne.PhotoProfil;
        }
    }
}
