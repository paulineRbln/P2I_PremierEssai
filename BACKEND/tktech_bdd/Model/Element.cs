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

        public Element() { }

        public Element(ElementDTO elementDTO)
        {
            Nom = elementDTO.Nom;
            Description = elementDTO.Description;

            // Conversion inverse de string en TypeElement
            if (Enum.TryParse(elementDTO.Type, out TypeElement typeElement))
            {
                Type = typeElement;  // On assigne le TypeElement après conversion
            }
            else
            {
                Type = TypeElement.Notif; // Valeur par défaut si la conversion échoue
            }

            EstFait = elementDTO.EstFait;

            // Si la date est non nulle et non vide, on la convertit, sinon on laisse null
            if (!string.IsNullOrEmpty(elementDTO.Date))
            {
                Date = DateTime.ParseExact(elementDTO.Date, "yyyy-MM-dd", null); // Conversion de string vers DateTime
            }
            else
            {
                Date = null; // On assigne null si la date est vide ou nulle
            }
        }
    }

    public class AssociationElements
    {
        public int Id { get; set; }
        public int ElementId1 { get; set; } // Premier élément
        public int ElementId2 { get; set; } // Deuxième élément
        public Element Element1 { get; set; } = null!; // Premier élément (relation)
        public Element Element2 { get; set; } = null!; // Deuxième élément (relation)

        public AssociationElements() { }

        // Constructeur qui prend un AssociationElementsDTO et initialise les propriétés
        public AssociationElements(AssociationElementsDTO associationElementsDTO)
        {
            ElementId1 = associationElementsDTO.ElementId1;
            ElementId2 = associationElementsDTO.ElementId2;
        }
    }
}
