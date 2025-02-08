using tktech_bdd.Dto;

public enum TypeAssociation
{
    Reservation,
    Inscription,
    Attribution,
    EnvoiNotif,
};

namespace tktech_bdd.Model

{
    public class Association
    {
        public int Id { get; set; }
        public int PersonneId { get; set; }
        public int ElementId { get; set; }
        public Personne Personne { get; set; } = null!;
        public Element Element { get; set; } = null!;
        public DateTime Date { get; set; }
        public TypeAssociation Type {get;set;}

        public Association (){}
        // Constructeur qui prend un AssociationDTO et initialise les propriétés
        public Association(AssociationDTO associationDTO)
        {
            Id = associationDTO.Id;
            PersonneId = associationDTO.PersonneId;
            ElementId = associationDTO.ElementId;
            Type = Enum.Parse<TypeAssociation>(associationDTO.Type); // Conversion de string vers TypeAssociation
            Date = DateTime.ParseExact(associationDTO.Date, "yyyy-MM-dd", null); // Conversion de string vers DateTime
        }
    }
}