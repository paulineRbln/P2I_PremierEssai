using Microsoft.EntityFrameworkCore;
using tktech_bdd.Model;

public class ProjetContext : DbContext
{
     // Définir les tables de la base de données
    public DbSet<Personne> Personnes { get; set; } = null!;
    public DbSet<Recurrence> Recurrences { get; set; } = null!;
    public DbSet<Element> Elements { get; set; } = null!;
    public DbSet<Association> Associations { get; set; } = null!;
    public string DbPath { get; private set; }

    public ProjetContext()
    {
        // Path to SQLite database file
        DbPath = "tktech.db";
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite($"Data Source={DbPath}");
    }
}
