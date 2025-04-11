using System.Text.RegularExpressions;
using tktech_bdd.Dto;
public enum TypeElement
{
    Event,
    Task,
    Notif,
    Objet,
};

namespace tktech_bdd.Model
{
    public class Element
    {
        public int Id { get; set; }
        public string Nom { get; set; } = null!;
        public string Description { get; set; } = null!;
        public TypeElement Type { get; set; }
        public List<Recurrence> JoursRecurrence { get; set; } = null!;
        public List<Association>? ListeAssociations { get; set; }
        public bool EstFait { get; set; }
        public DateTime? Date { get; set; } // DateTime? pour la rendre nullable
        public int? AssociationAUnElement { get; set; }  // Rendre nullable pour gérer les cas particuliers

        public Element() { }

        public Element(ElementDTO elementDTO)
        {
            Nom = elementDTO.Nom;
            Description = elementDTO.Description;

            // Conversion inverse de string en TypeElement
            if (Enum.TryParse(elementDTO.Type, out TypeElement typeElement))
            {
                Type = typeElement;  
            }
            else
            {
                Type = TypeElement.Notif; // Valeur par défaut si la conversion échoue
            }

            EstFait = elementDTO.EstFait;

            // Si la date est non nulle et non vide, on la convertit, sinon on laisse null
            if (!string.IsNullOrEmpty(elementDTO.Date))
            {
                Date = DateTime.ParseExact(elementDTO.Date, "yyyy-MM-dd", null); 
            }
            else
            {
                Date = null; // On assigne null si la date est vide ou nulle
            }

            // Si AssociationAUnElement est spécifié dans le DTO, on l'assigne
            if (elementDTO.AssociationAUnElement.HasValue)
            {
                AssociationAUnElement = elementDTO.AssociationAUnElement.Value;
            }
        }
    }


}
