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
        public TypeElement Type {get;set;}
        public List<Recurrence> JoursRecurrence {get;set;}=null!;
        public List<Association>? ListeAssociations { get; set; }
        public bool EstFait { get; set; }
    

        public Element (){}
        public Element(ElementDTO elementDTO)
        {
            Id = elementDTO.Id;
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
        }
        }
}


    