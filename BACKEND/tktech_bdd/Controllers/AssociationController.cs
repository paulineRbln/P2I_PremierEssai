using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tktech_bdd.Model;
using tktech_bdd.Dto;
using Swashbuckle.AspNetCore.Annotations;

namespace tktech_bdd.Controllers
{
    [ApiController]
    [Route("api/association")]
    public class AssociationController : ControllerBase
    {
        private readonly ProjetContext _context;

        public AssociationController(ProjetContext context)
        {
            _context = context;
        }

        // GET: api/association
        [SwaggerOperation(
            Summary = "Liste des associations",
            Description = "Retourne la liste de toutes les associations"
        )]
        [SwaggerResponse(StatusCodes.Status200OK, "Liste des associations trouvée", typeof(IEnumerable<AssociationDTO>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Aucune association trouvée")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssociationDTO>>> GetAssociations()
        {
            var associationsDTO = await _context.Associations
                .Include(a => a.Personne)  // Inclure les entités associées (Personne et Element)
                .Include(a => a.Element)
                .Select(a => new AssociationDTO(a))  // Convertir en DTO
                .ToListAsync();

            return Ok(associationsDTO.Any() ? associationsDTO : new List<AssociationDTO>()); // Retourner un tableau vide si aucune association n'est trouvée
        }

        // GET: api/association/{id}
        [SwaggerOperation(
            Summary = "Association grâce à identifiant",
            Description = "Retourne une association à partir de son identifiant"
        )]
        [SwaggerResponse(StatusCodes.Status200OK, "Association trouvée", typeof(AssociationDTO))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Association non trouvée")]
        [HttpGet("{id}")]
        public async Task<ActionResult<AssociationDTO>> GetAssociationById(
            [FromRoute, SwaggerParameter(Description = "Identifiant de l'association (doit être un entier)")]
                int id
        )
        {
            var associationDTO = await _context
                .Associations
                .Include(a => a.Personne)  // Inclure les entités associées
                .Include(a => a.Element)
                .Where(a => a.Id == id)
                .Select(a => new AssociationDTO(a))
                .SingleOrDefaultAsync();

            return Ok(associationDTO ?? new AssociationDTO()); // Retourner un objet vide si l'association n'est pas trouvée
        }

        // GET: api/association/personne/{personneId}/element/{elementId}
        [SwaggerOperation(
            Summary = "Vérifier si une personne est associée à un élément",
            Description = "Retourne une réponse indiquant si la personne est associée à l'élément spécifié"
        )]
        [SwaggerResponse(StatusCodes.Status200OK, "Association trouvée", typeof(EstAssocieDTO))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Aucune association trouvée")]
        [HttpGet("personne/{personneId}/element/{elementId}")]
        public async Task<ActionResult<EstAssocieDTO>> GetAssociationByPersonneAndElement(
            [FromRoute] int personneId,
            [FromRoute] int elementId
        )
        {
            // Recherche de l'association entre la personne et l'élément dans la base de données
            var association = await _context.Associations
                .Where(a => a.PersonneId == personneId && a.ElementId == elementId)
                .FirstOrDefaultAsync();

            // Si l'association est trouvée, renvoyer un DTO avec les informations
            if (association != null)
            {
                var estAssocieDTO = new EstAssocieDTO(
                    association.PersonneId,
                    association.ElementId,
                    association.Id
                );
                return Ok(estAssocieDTO);
            }

            // Si aucune association n'est trouvée, renvoyer un DTO avec `estAssocie` à false
            var estAssocieDTONotFound = new EstAssocieDTO(personneId, elementId, 0);
            return Ok(estAssocieDTONotFound);
        }

        // POST: api/association
        [SwaggerOperation(
            Summary = "Ajout d'une nouvelle association",
            Description = "Ajoute une nouvelle association à la base de données"
        )]
        [SwaggerResponse(StatusCodes.Status200OK, "Association ajoutée", typeof(AssociationDTO))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Association non ajoutée")]
        [HttpPost]
        public async Task<ActionResult<AssociationDTO>> PostAssociation(AssociationDTO associationDTO)
        {
            // Créer une nouvelle instance d'Association en utilisant le DTO
            Association association = new Association(associationDTO);
            _context.Associations.Add(association);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetAssociationById),
                new { id = association.Id },
                new AssociationDTO(association)
            );
        }

        // PUT: api/association/{id}
        [SwaggerOperation(
            Summary = "Modifier une association",
            Description = "Modifie une association à partir de son identifiant"
        )]
        [SwaggerResponse(StatusCodes.Status200OK, "Association modifiée", typeof(AssociationDTO))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Association non modifiée")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAssociation(
            [FromRoute, SwaggerParameter(Description = "Identifiant de l'association (doit être un entier)")]
                int id,
            AssociationDTO associationDTO
        )
        {
            if (id != associationDTO.Id)
                return BadRequest();

            // Mettre à jour l'association
            Association association = new Association(associationDTO);
            _context.Entry(association).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Associations.Any(a => a.Id == id))
                    return Ok(new AssociationDTO()); // Retourner un objet vide si l'association n'existe pas
                else
                    throw;
            }

            return Ok(associationDTO);
        }

        // DELETE: api/association/{id}
        [SwaggerOperation(
            Summary = "Supprimer une association",
            Description = "Supprime une association définitivement"
        )]
        [SwaggerResponse(StatusCodes.Status200OK, "Association supprimée", typeof(AssociationDTO))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Association non supprimée")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssociation(
            [FromRoute, SwaggerParameter(Description = "Identifiant de l'association (doit être un entier)")]
                int id
        )
        {
            var association = await _context.Associations.FindAsync(id);

            if (association == null)
                return Ok(new AssociationDTO()); // Retourner un objet vide si l'association n'est pas trouvée

            _context.Associations.Remove(association);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // GET: api/association/news/{personneId}
        [HttpGet("news/{personneId}")]
        public async Task<ActionResult<IEnumerable<NewsDTO>>> GetNews(int personneId)
        {
            // Récupérer les événements auxquels la personne est inscrite
            var evenementsPersonne = await _context.Associations
                .Where(a => a.PersonneId == personneId && a.Type == TypeAssociation.Inscription)  // Filtrer les inscriptions
                .Select(a => a.ElementId)  // On récupère les éléments (événements) où cette personne est inscrite
                .Distinct()
                .ToListAsync();

            if (evenementsPersonne == null || !evenementsPersonne.Any())
            {
                return Ok(new List<NewsDTO>()); // Retourner un tableau vide si aucune news n'est trouvée
            }

            // Obtenir la date du jour sans l'heure pour effectuer une comparaison (toutes les notifications de ce jour)
            var today = DateTime.Today;

            // Récupérer les éléments qui appartiennent aux événements de la personne et qui ont une notification associée pour ce jour
            var notificationsElements = await _context.Elements
                .Where(e => e.AssociationAUnElement.HasValue && evenementsPersonne.Contains(e.AssociationAUnElement.Value))
                .Where(e => e.Date == today) // Filtrer les éléments de notification pour aujourd'hui
                .Select(e => e.Id)
                .ToListAsync();

            // Récupérer toutes les associations dont l'ID de l'élément correspond aux notifications récupérées
            var associations = await _context.Associations
                .Where(a => notificationsElements.Contains(a.ElementId) // Filtrer les associations dont l'élément correspond aux notifications
                            && a.PersonneId != personneId // Exclure les associations où la personne est inscrite
                            && a.Type == TypeAssociation.EnvoiNotif) // Assurer que ce sont des notifications
                .Include(a => a.Personne)  // Inclure les informations de la personne
                .Include(a => a.Element)   // Inclure les informations de l'élément (événement)
                .ToListAsync();

            // Mapper les résultats en NewsDTO
            var newsDTO = associations.Select(a => new NewsDTO(a)).ToList();

            // Récupérer les autres associations (inscriptions, réservations) pour les événements où la personne est inscrite
            var otherNews = await _context.Associations
                .Where(a => (evenementsPersonne.Contains(a.ElementId) && a.Type == TypeAssociation.Inscription && a.PersonneId != personneId) // Exclure les événements où la personne est inscrite
                            || (a.Type == TypeAssociation.Reservation && a.PersonneId != personneId)) 
                .Where(a => a.Date >= today)
                .Include(a => a.Personne)  // Inclure les informations de la personne
                .Include(a => a.Element)   // Inclure les informations de l'élément (événement)
                .ToListAsync();

            // Mapper les résultats en NewsDTO
            var additionalNewsDTO = otherNews.Select(a => new NewsDTO(a)).ToList();

            // Fusionner les deux résultats : notifications du jour et autres notifications/news
            var allNews = newsDTO.Concat(additionalNewsDTO).ToList();

            // Retourner les résultats
            return Ok(allNews);
        }




        // GET: api/association/reservations
        [HttpGet("news/reservations")]
        public async Task<ActionResult<IEnumerable<NewsDTO>>> GetResa()
        {
            // Récupérer toutes les réservations, sans tenir compte de la personne (toutes les réservations)
            var news = await _context.Associations
                .Where(a => a.Type == TypeAssociation.Reservation) // Récupérer uniquement les réservations
                .Include(a => a.Personne)  // Inclure les informations de la personne liée à la réservation
                .Include(a => a.Element)   // Inclure les informations de l'élément (événement ou objet réservé)
                .ToListAsync();

            // Mapper les résultats en NewsDTO
            var newsDTO = news.Select(a => new NewsDTO(a)).ToList();

            return Ok(newsDTO); // Retourner toutes les réservations sous forme de NewsDTO
        }

        // GET: api/association/events/{eventId}/notifications
        [HttpGet("events/{eventId}/notifications")]
        public async Task<ActionResult<IEnumerable<NewsDTO>>> GetNotificationsByEventId(int eventId)
        {
            var notifications = await _context.Elements
                .Where(e => e.Type == TypeElement.Notif && e.AssociationAUnElement == eventId)  // Filtrer par les éléments de type 'Notif'
                .ToListAsync();

            if (notifications == null || !notifications.Any())
            {
                return Ok(new List<NewsDTO>());
            }

            var associations = await _context.Associations
                .Where(a => notifications.Select(n => n.Id).Contains(a.ElementId))  // Filtrer les associations où ElementId correspond aux notifications récupérées
                .Include(a => a.Personne)  // Inclure la personne associée à l'association
                .Include(a => a.Element)   // Inclure l'élément de l'association
                .ToListAsync();

            var newsDTO = associations.Select(a => new NewsDTO(a)).ToList();

            return Ok(newsDTO);
        }

    }
}
