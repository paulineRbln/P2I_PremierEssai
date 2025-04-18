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

    //DTO qui permet de voir facilement l'association entre une personne et un élement (sans les autres informations)

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

    //DTO qui va permettre d'afficher les associations de manière organisée pour le front 
    //Il permet pour chaque type d'Association de rédiger un message correspondant 
    //Son appel permet de faire les vignettes dans le front 

    public class NewsDTO
    {
        public int Id  { get; set; }
        public string Titre { get; set; } = null!;
        public int PersonneId { get; set; }
        public int ObjetId { get; set; }
        public string Description { get; set; } = null!;
        public string Date { get; set; } = null!;
        public string Element { get; set; } = null!;

        public string Type { get; set; } = null!;

        // Constructeur pour initialiser avec les données d'une association
        public NewsDTO(Association association)
        {
            if (association.Type == TypeAssociation.Inscription)
            {
                Id = association.Id;
                Titre = "Nouvelle inscription";
                PersonneId = association.PersonneId;
                ObjetId = association.ElementId;
                Description = $"{association.Personne.Prenom} s'est inscrit à {association.Element.Nom}";
                Date = association.Date?.ToString("yyyy-MM-dd") ?? string.Empty;
                Element = association.Element.Nom;
                Type = "Inscription";
            }
            else if (association.Type == TypeAssociation.Reservation)
            {
                Id = association.Id;
                Titre = "Nouvelle réservation";
                PersonneId = association.PersonneId;
                ObjetId = association.ElementId;
                Description = $"{association.Personne.Prenom} a réservé {association.Element.Nom} pour le {association.Date?.ToString("yyyy-MM-dd")}";
                Date = association.Date?.ToString("yyyy-MM-dd") ?? string.Empty;
                Element = association.Element.Nom;
                Type = "Reservation";
            }
            else if (association.Type == TypeAssociation.Attribution)
            {
                Id = association.Id;
                Titre = "Nouvelle attribution";
                PersonneId = association.PersonneId;
                ObjetId = association.ElementId;
                Description = $"{association.Personne.Prenom} se charge de {association.Element.Nom} pour le {association.Date?.ToString("yyyy-MM-dd")}";
                Date = association.Date?.ToString("yyyy-MM-dd") ?? string.Empty;
                Element = association.Element.Nom;
                Type = "Attribution";
            }
            else
            {
                Id = association.Id;
                Titre = $"{association.Date?.ToString("yyyy-MM-dd")} : {association.Personne.Prenom} - {association.Element.Nom}";
                PersonneId = association.PersonneId;
                ObjetId = association.ElementId;
                Description = $"{association.Element.Description}";
                Date = association.Date?.ToString("yyyy-MM-dd") ?? string.Empty;
                Element = association.Element.Nom;
                Type = "Notif";
            }

        }
    }
}
