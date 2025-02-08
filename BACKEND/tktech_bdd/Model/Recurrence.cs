using tktech_bdd.Dto;
namespace tktech_bdd.Model
{
    public class Recurrence
    {
        public int Id { get; set; }
        public int ElementId { get; set; }
        public Element Element { get; set; } = null!;
        public DateTime Date { get; set; }

        // Constructeur par défaut
        public Recurrence() { }

        // Constructeur qui initialise les propriétés à partir de RecurrenceDTO
        public Recurrence(RecurrenceDTO recurrenceDTO)
        {
            Id = recurrenceDTO.Id;
            ElementId = recurrenceDTO.ElementId;
            Date = DateTime.Parse(recurrenceDTO.Date); // Conversion de string en DateTime
        }
    }
}
