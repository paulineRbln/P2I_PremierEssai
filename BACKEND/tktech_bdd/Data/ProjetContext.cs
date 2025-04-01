using Microsoft.EntityFrameworkCore;
using tktech_bdd.Model;

public class ProjetContext : DbContext
{
    // Définir les tables de la base de données
    public DbSet<Personne> Personnes { get; set; } = null!;
    public DbSet<Recurrence> Recurrences { get; set; } = null!;
    public DbSet<Element> Elements { get; set; } = null!;
    public DbSet<Association> Associations { get; set; } = null!;
    public DbSet<Score>  Scores{ get; set; } = null!;

    public string DbPath { get; private set; }

    // Constructeur avec DbContextOptions<ProjetContext>
    public ProjetContext(DbContextOptions<ProjetContext> options)
        : base(options)
    {
        // Ici, tu peux conserver ou définir ton DbPath si nécessaire
        DbPath = "tktech.db";  // C'est ici que tu spécifies ton chemin SQLite
    }

    // Méthode OnConfiguring pour définir la configuration SQLite si nécessaire
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        if (!options.IsConfigured) // S'assurer qu'on ne configure pas si ça a déjà été fait ailleurs
        {
            // Configuration de SQLite avec le chemin spécifié
            options.UseSqlite($"Data Source={DbPath}");
        }
    }
}
