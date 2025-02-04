namespace tktech_bdd.Model

{
    public class EnvoiNotif
    {
        public int Id {get;set;}
        public int NotifId { get; set; }
        public Notif Notif { get; set; } = null!;
        public int PersonneId { get; set; }
        public Personne Destinataire { get; set; } = null!;
    }
}