using System.Text.Json.Serialization;
using tktech_bdd.Model;

namespace tktech_bdd.Dto
{
    public class RecurrenceDTO
    {
        public int Id { get; set; }

        [JsonPropertyName("element_id")]
        public int ElementId { get; set; }

        public string Date { get; set; }=null!;

        // Constructeur par défaut
        public RecurrenceDTO() { }

        // Constructeur qui initialise les propriétés à partir de l'entité Recurrence
        
            public RecurrenceDTO(Recurrence recurrence)
        {
            Id = recurrence.Id;
            ElementId = recurrence.ElementId;
            // Conversion de DateTime en chaîne de caractères (format souhaité, ici ISO 8601)
            Date = recurrence.Date.ToString("yyyy-MM-ddTHH:mm:ss");
        }
    }
}
