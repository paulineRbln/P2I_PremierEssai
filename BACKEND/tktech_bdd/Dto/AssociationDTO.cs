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
            Date = association.Date?.ToString("yyyy-MM-dd") ?? string.Empty;  // Utilise une valeur par défaut si Date est null
        }
    }

    public class EstAssocieDTO
    {
        public int PersonneId { get; set; }
        public int ElementId { get; set; }
        public int Id { get; set; }

        public EstAssocieDTO() { }

        // Constructeur qui initialise les propriétés à partir de l'entité Association
        public EstAssocieDTO(int idP, int idE, int id)
        {
            
            PersonneId = idP;
            ElementId = idE;
            Id = id;        }
    }

    public class NewsDTO
    {
        public string Titre { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Date { get; set; } = null!;
        public string Element { get; set; } = null!;

        // Constructeur pour initialiser avec les données d'une association
        public NewsDTO(Association association)
        {
            if (association.Type == TypeAssociation.Inscription)
            {
                Titre = "Nouvelle inscription";
                Description = $"{association.Personne.Prenom} s'est inscrit à {association.Element.Nom}";
                Date = association.Date?.ToString("yyyy-MM-dd") ?? string.Empty;
                Element = association.Element.Nom;
            }
            else if (association.Type == TypeAssociation.Reservation)
            {
                Titre = "Nouvelle réservation";
                Description = $"{association.Personne.Prenom} a réservé {association.Element.Nom} pour le {association.Date?.ToString("yyyy-MM-dd")}";
                Date = association.Date?.ToString("yyyy-MM-dd") ?? string.Empty;
                Element = association.Element.Nom;
            }
            else
            {
                Titre = "Notification";
                Description = "Détails de la notification non disponibles.";
                Date = association.Date?.ToString("yyyy-MM-dd") ?? string.Empty;
                Element = association.Element.Nom;
            }

        }
    }
}
