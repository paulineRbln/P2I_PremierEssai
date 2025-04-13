using tktech_bdd.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace tktech_bdd.Data
{
    public static class SeedData
    {
        public static void Initialize(ProjetContext context)
        {
            if (context.Personnes.Any() || context.Elements.Any() || context.Associations.Any() || context.Recurrences.Any())
                return;

            // Création des personnes
            var pauline = new Personne
            {
                Nom = "Roblin",
                Prenom = "Pauline",
                Pseudo = "pauline123",
                PhotoProfil = "pauline.jpg",
                MotDePasse = "motdepassepauline",
                EstProprio = false
            };

            var martin = new Personne
            {
                Nom = "Coloc",
                Prenom = "Martin",
                Pseudo = "martin789",
                PhotoProfil = "martin.jpg",
                MotDePasse = "motdepassemartin",
                EstProprio = false
            };

            var proprio = new Personne
            {
                Nom = "De la maison",
                Prenom = "Propriétaire",
                Pseudo = "proprietaire456",
                PhotoProfil = "proprio.jpg",
                MotDePasse = "motdepasseproprio",
                EstProprio = true
            };

            context.Personnes.AddRange(pauline, martin, proprio);
            context.SaveChanges();

            // Scores
            context.Scores.AddRange(
                new Score { PersonneId = pauline.Id },
                new Score { PersonneId = martin.Id },
                new Score { PersonneId = proprio.Id }
            );
            context.SaveChanges();

            // Objets
            var caveTV = new Element { Nom = "Cave TV", Description = "A aérer souvent", Type = TypeElement.Objet };
            var secheLinge = new Element { Nom = "Sèche Linge", Description = "Nettoyer les filtres et vider l'eau", Type = TypeElement.Objet };
            var four = new Element { Nom = "Four", Description = "Nettoyer les grilles et la vitre", Type = TypeElement.Objet };
            var barbecueObj = new Element { Nom = "Barbecue", Description = "Acheter régulièrement du charbon et des cagettes", Type = TypeElement.Objet };

            context.Elements.AddRange(caveTV, secheLinge, four, barbecueObj);
            context.SaveChanges();

            // Événements
            var barbecue = new Element
            {
                Nom = "Barbecue tous ensemble",
                Description = "Début à 20h30",
                Type = TypeElement.Event,
                Date = new DateTime(2025, 4, 20)
            };

            var laserGame = new Element
            {
                Nom = "Sortie Laser Game",
                Description = "RDV à 18h30 à Mérignac",
                Type = TypeElement.Event,
                Date = new DateTime(2025, 4, 18)
            };

            context.Elements.AddRange(barbecue, laserGame);
            context.SaveChanges();

            // Tâches
            var tachePoubelles = new Element
            {
                Nom = "Sortir les poubelles",
                Description = "Le mercredi et le jeudi",
                Type = TypeElement.Task,
                EstFait = false
            };
            var tacheLaveVaisselle = new Element
            {
                Nom = "Vider le lave vaisselle",
                Description = "Dès qu'il est propre",
                Type = TypeElement.Task,
                EstFait = false
            };
            var tachePlaques = new Element
            {
                Nom = "Nettoyer les plaques de cuisson",
                Description = "Avec le produit bleu",
                Type = TypeElement.Task,
                EstFait = false
            };

            context.Elements.AddRange(tachePoubelles, tacheLaveVaisselle, tachePlaques);
            context.SaveChanges();

            // Notifications
            var notifColoc = new Element
            {
                Nom = "Arrivée d'un nouveau coloc",
                Description = "Il s'installera le 21/04/2025",
                Type = TypeElement.Notif,
                Date = DateTime.Today
            };

            var notifFour = new Element
            {
                Nom = "Ventilation en panne",
                Description = "Je passe le réparer la semaine prochaine",
                Type = TypeElement.Notif,
                Date = new DateTime(2025, 4, 13),
                AssociationAUnElement = four.Id
            };

            context.Elements.AddRange(notifColoc, notifFour);
            context.SaveChanges();

            // Associations
            context.Associations.AddRange(
                // Inscriptions événements
                new Association { PersonneId = pauline.Id, ElementId = barbecue.Id, Type = TypeAssociation.Inscription },
                new Association { PersonneId = martin.Id, ElementId = barbecue.Id, Type = TypeAssociation.Inscription },
                new Association { PersonneId = martin.Id, ElementId = laserGame.Id, Type = TypeAssociation.Inscription },

                // Tâches attribuées
                new Association { PersonneId = pauline.Id, ElementId = tacheLaveVaisselle.Id, Type = TypeAssociation.Attribution, Date = new DateTime(2025, 4, 16) },
                new Association { PersonneId = martin.Id, ElementId = tachePoubelles.Id, Type = TypeAssociation.Attribution, Date = new DateTime(2025, 4, 17) },

                // Réservations objets
                new Association { PersonneId = pauline.Id, ElementId = caveTV.Id, Type = TypeAssociation.Reservation, Date = new DateTime(2025, 4, 23) },
                new Association { PersonneId = martin.Id, ElementId = secheLinge.Id, Type = TypeAssociation.Reservation, Date = new DateTime(2025, 4, 25) },
                new Association { PersonneId = proprio.Id, ElementId = four.Id, Type = TypeAssociation.Reservation, Date = new DateTime(2025, 4, 19) },

                // Envois de notifications
                new Association { PersonneId = proprio.Id, ElementId = notifColoc.Id, Type = TypeAssociation.EnvoiNotif , Date = new DateTime(2025, 4, 13)},
                new Association { PersonneId = proprio.Id, ElementId = notifFour.Id, Type = TypeAssociation.EnvoiNotif, Date = new DateTime(2025, 4, 13) }
            );

            context.SaveChanges();
        }
    }
}
