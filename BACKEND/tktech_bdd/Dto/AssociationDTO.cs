using tktech_bdd.Model;

namespace tktech_bdd.Dto
{
    public class AssociationDTO
    {
        public int Id { get; set; }
        public int PersonneId { get; set; }
        public int ElementId { get; set; }
        public string Type { get; set; } = null!;
        public string Date { get; set; } = null!;

        public AssociationDTO() { }

        // Constructeur qui initialise les propriétés à partir de l'entité Association
        public AssociationDTO(Association association)
        {
            Id = association.Id;
            PersonneId = association.PersonneId;
            ElementId = association.ElementId;

            // Conversion de TypeAssociation en string
            Type = association.Type.ToString();

            // Conversion de DateTime en string (format 'yyyy-MM-dd')
            Date = association.Date.ToString("yyyy-MM-dd");
        }
    }
}
