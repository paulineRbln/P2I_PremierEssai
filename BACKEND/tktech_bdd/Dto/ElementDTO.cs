using tktech_bdd.Model;
namespace tktech_bdd.Dto
{
    public class ElementDTO
    {
        public int Id {get;set;}
        public string Nom { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Type { get; set; }=null!;
        public bool EstFait { get; set; }

        public ElementDTO(){}
        
        // Constructeur qui initialise les propriétés à partir de l'entité Personne
        public ElementDTO(Element element)
        {
            Id = element.Id;
            Nom = element.Nom;
            Description = element.Description;

            // Si Type est un string et tu veux le convertir en TypeElement
            if (Enum.TryParse(element.Type.ToString(), out TypeElement typeElement))
            {
                Type = typeElement.ToString();  // Ici on retourne un string représentant le TypeElement
            }
            else
            {
                Type = TypeElement.Notif.ToString();  // Valeur par défaut si la conversion échoue
            }

            EstFait = element.EstFait;
        }
    }
}
