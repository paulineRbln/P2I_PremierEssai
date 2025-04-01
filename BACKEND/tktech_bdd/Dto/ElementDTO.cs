using tktech_bdd.Model;
namespace tktech_bdd.Dto
{
    public class ElementDTO
    {
        public int Id { get; set; }
        public string Nom { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Type { get; set; } = null!;
        public bool EstFait { get; set; }
        public string? Date { get; set; }
        public int? AssociationAUnElement { get; set; }  // Rendre nullable

        public ElementDTO() { }

        // Constructeur qui initialise les propriétés à partir de l'entité Element
        public ElementDTO(Element element)
        {
            Id = element.Id;
            Nom = element.Nom;
            Description = element.Description;

            // Convertir Type de Enum en string
            Type = element.Type.ToString();

            EstFait = element.EstFait;

            // Vérifier si Date est null avant d'utiliser ToString()
            Date = element.Date?.ToString("yyyy-MM-dd") ?? string.Empty;  // Utilise une valeur par défaut si Date est null

            // Si AssociationAUnElement est null, on laisse null, sinon on l'assigne
            AssociationAUnElement = element.AssociationAUnElement;
        }
    }

}
