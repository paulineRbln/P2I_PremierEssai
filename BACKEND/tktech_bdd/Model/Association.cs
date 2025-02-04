public enum TypeAssociation
{
    Reservation,
    Inscription,
    Attribution,
};

namespace tktech_bdd.Model

{
    public class Association
    {
        public int Id { get; set; }
        public string Nom { get; set; }=null!;
        public int PersonneId { get; set; }
        public int ElementId { get; set; }
        public Personne Personne { get; set; } = null!;
        public Element Element { get; set; } = null!;
        public DateTime Date { get; set; }
        public TypeAssociation Type {get;set;}
    }
}