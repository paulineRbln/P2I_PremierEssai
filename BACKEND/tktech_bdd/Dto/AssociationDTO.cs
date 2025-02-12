using tktech_bdd.Model;

namespace tktech_bdd.Dto
{
    public class AssociationDTO
    {
        public int Id { get; set; }
        public int PersonneId { get; set; }
        public string PersonneName { get; set; }=null!;
        public int ElementId { get; set; }
        public string ElementName { get; set; }=null!;
        public string Type { get; set; } = null!;
        public string Date { get; set; } = null!;

        public AssociationDTO() { }

        // Constructeur qui initialise les propriétés à partir de l'entité Association
        public AssociationDTO(Association association)
        {
            Id = association.Id;
            PersonneId = association.PersonneId;
            ElementId = association.ElementId;
            PersonneName = association.Personne.Prenom;
            ElementName = association.Element.Nom;

            // Conversion de TypeAssociation en string
            Type = association.Type.ToString();
            Date = association.Date?.ToString("yyyy-MM-dd") ?? string.Empty;  // Utilise une valeur par défaut si Date est null
        }
    }
}
