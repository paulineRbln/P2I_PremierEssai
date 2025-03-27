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
        public string ?Date {get;set;}

        public ElementDTO(){}
        
        // Constructeur qui initialise les propriétés à partir de l'entité Personne
        public ElementDTO(Element element)
        {
            Id = element.Id;
            Nom = element.Nom;
            Description = element.Description;

            // Convertir Type de string en Enum
            if (Enum.TryParse(element.Type.ToString(), out TypeElement typeElement))
            {
                Type = typeElement.ToString();
            }
            else
            {
                Type = TypeElement.Notif.ToString();
            }

            EstFait = element.EstFait;

            // Vérifier si Date est null avant d'utiliser ToString()
            Date = element.Date?.ToString("yyyy-MM-dd") ?? string.Empty;  // Utilise une valeur par défaut si Date est null
        }

    }

    public class AssociationElementsDTO
    {
        public int ElementId1 { get; set; }
        public int ElementId2 { get; set; }

        public AssociationElementsDTO() { }

        public AssociationElementsDTO(AssociationElements associationElements)
        {
            ElementId1 = associationElements.ElementId1;
            ElementId2 = associationElements.ElementId2;
        }
    }
}
