using tktech_bdd.Model;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace tktech_bdd.Data
{
    public static class SeedData
    {
        public static void Initialize(ProjetContext context)
        {
            // Vérifier si des données existent déjà
            if (context.Personnes.Any() || context.Elements.Any() || context.Associations.Any() || context.Recurrences.Any())
            {
                return; // Les données existent déjà, donc on ne fait rien
            }

            // Création des personnes
            var personnePauline = new Personne
            {
                Nom = "Roblin",
                Prenom = "Pauline",
                Pseudo = "pauline123",
                PhotoProfil = "pauline.jpg",
                MotDePasse = "motdepassepauline",
                EstProprio = false
            };
            var personneMartin = new Personne
            {
                Nom = "Caroff",
                Prenom = "Martin",
                Pseudo = "martin456",
                PhotoProfil = "martin.jpg",
                MotDePasse = "motdepassemartin",
                EstProprio = false
            };
            var personneStephane = new Personne
            {
                Nom = "DD",
                Prenom = "Stephane",
                Pseudo = "stephaneProprio",
                PhotoProfil = "stephane.jpg",
                MotDePasse = "motdepassestephane",
                EstProprio = true
            };

            // Ajouter les personnes
            context.Personnes.AddRange(personnePauline, personneMartin, personneStephane);
            context.SaveChanges();  // Sauvegarder pour s'assurer que les Personnes ont des Id

            // Création d'un Score pour chaque personne ajoutée
            var scorePauline = new Score
            {
                Id = personnePauline.Id,
                PersonneId = personnePauline.Id, // Lier le score à la personne
                NbTaches = 0,
                NbEvenementsCree = 0,
                NbEvenementsParticipe = 0,
                NbReservations = 0,
                NbProblemesAnnonces = 0,
                NbElementsAchetes = 0
            };
            var scoreMartin = new Score
            {
                Id = personneMartin.Id,
                PersonneId = personneMartin.Id, // Lier le score à la personne
                NbTaches = 0,
                NbEvenementsCree = 0,
                NbEvenementsParticipe = 0,
                NbReservations = 0,
                NbProblemesAnnonces = 0,
                NbElementsAchetes = 0
            };
            var scoreStephane = new Score
            {
                Id = personneStephane.Id,
                PersonneId = personneStephane.Id, // Lier le score à la personne
                NbTaches = 0,
                NbEvenementsCree = 0,
                NbEvenementsParticipe = 0,
                NbReservations = 0,
                NbProblemesAnnonces = 0,
                NbElementsAchetes = 0
            };

            // Ajouter les scores dans la base de données
            context.Scores.AddRange(scorePauline, scoreMartin, scoreStephane);
            context.SaveChanges(); // Sauvegarder les scores dans la base de données

            // Création des éléments
            var tache1 = new Element
            {
                Nom = "Nettoyage des toilettes",
                Description = "Passer un coup d'aspirateur",
                Type = TypeElement.Task,
                EstFait = false,
                Date = null
            };

            var tache2 = new Element
            {
                Nom = "Faire la vaisselle",
                Description = "Nettoyer la vaisselle",
                Type = TypeElement.Task,
                EstFait = false,
                Date = null
            };

            var eventElement = new Element
            {
                Nom = "Événement anniversaire",
                Description = "Fêter un anniversaire",
                Type = TypeElement.Event,
                EstFait = false,
                Date = new DateTime(2025, 02, 20) // Exemple de date pour l'événement
            };

            var objet = new Element
            {
                Nom = "Table",
                Description = "Table en bois pour la salle à manger",
                Type = TypeElement.Objet,
                EstFait = false,
                Date = null
            };

            var notif = new Element
            {
                Nom = "Notification importante",
                Description = "Rappels de la réunion",
                Type = TypeElement.Notif,
                EstFait = false,
                Date = null
            };

            // Ajouter les éléments
            context.Elements.AddRange(tache1, tache2, eventElement, objet, notif);
            context.SaveChanges();  // Sauvegarder pour que les éléments aient des Id

            // Création des récurrences pour l'événement
            var recurrenceEvent = new Recurrence
            {
                ElementId = eventElement.Id,
                Date = new DateTime(2025, 03, 20) // Exemple de récurrence un mois plus tard
            };

            // Ajouter les récurrences
            context.Recurrences.Add(recurrenceEvent);
            context.SaveChanges();  // Sauvegarder pour que les récurrences aient des Id

            // Création des associations
            var associationPaulineEvent = new Association
            {
                PersonneId = personnePauline.Id,
                ElementId = eventElement.Id,
                Type = TypeAssociation.Inscription // Pauline inscrit à l'événement
            };

            var associationPaulineTache = new Association
            {
                PersonneId = personnePauline.Id,
                ElementId = tache1.Id,
                Type = TypeAssociation.Attribution // Pauline assignée à la tache1
            };

            var associationMartinTache1 = new Association
            {
                PersonneId = personneMartin.Id,
                ElementId = tache1.Id,
                Type = TypeAssociation.Attribution // Martin assigné à la tache1
            };

            var associationMartinTache2 = new Association
            {
                PersonneId = personneMartin.Id,
                ElementId = tache2.Id,
                Type = TypeAssociation.Attribution // Martin assigné à la tache2
            };

            var associationProprioObjet = new Association
            {
                PersonneId = personneStephane.Id,
                ElementId = objet.Id,
                Type = TypeAssociation.Reservation, // Le proprio réserve l'objet
                Date = new DateTime(2025, 03, 12)
            };

            // Ajouter les associations
            context.Associations.AddRange(associationPaulineEvent, associationPaulineTache, associationMartinTache1, associationMartinTache2, associationProprioObjet);
            context.SaveChanges();  // Sauvegarder une dernière fois pour les associations
        }
    }
}
