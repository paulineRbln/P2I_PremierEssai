using tktech_bdd.Model;
namespace tktech_bdd.Dto
{
    public class PersonneDTO
    {
        public int Id {get;set;}
        public string Nom { get; set; } = null!;
        public string Prenom { get; set; } = null!;
        public string Pseudo { get; set; } = null!;
        public string PhotoProfil { get; set; } = null!;



        public PersonneDTO(){}
        
        // Constructeur qui initialise les propriétés à partir de l'entité Personne
        public PersonneDTO(Personne personne)
        {
            Id = personne.Id;
            Nom = personne.Nom;
            Prenom = personne.Prenom;
            Pseudo = personne.Pseudo;
            PhotoProfil = personne.PhotoProfil;
        }
    }

    // DTO pour la requête de login
    public class LoginRequest
    {
        public string Pseudo { get; set; }=null!;
        public string MotDePasse { get; set; }=null!;
    }
}
