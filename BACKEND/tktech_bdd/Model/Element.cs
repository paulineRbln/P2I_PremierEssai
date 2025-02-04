using System.Text.RegularExpressions;
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
    }

    public class Associable : Element
    {
        public List<Association>? ListeAssociations { get; set; } 
    }

    // Classe Notif qui hérite de Element
    public class Notif : Element
    {
        public List<EnvoiNotif> ListeDestinataires { get; set; } =null!;

        public Notif()
        {
            this.Type = TypeElement.Notif;  // Type spécifique à Notif
        }
    }

    public class Tache : Associable
    {
        public bool EstFait { get; set; }

        public Tache()
        {
            this.Type = TypeElement.Task;  // Type spécifique à Tache
        }
    }
}
