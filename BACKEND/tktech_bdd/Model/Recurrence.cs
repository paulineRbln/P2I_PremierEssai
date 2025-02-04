namespace tktech_bdd.Model

{
    public class Recurrence
    {
        public int Id {get;set;}
        public int ElementId { get; set; }
        public Element Element { get; set; }=null!;
        public DateTime Date {get;set;}
    }
}