using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tktech_bdd.Model;
using tktech_bdd.Dto;
using Swashbuckle.AspNetCore.Annotations;

namespace tktech_bdd.Controllers
{
    // [GET] /api/association - Récupère toutes les associations
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
        // Récupère la liste de toutes les associations
        [SwaggerOperation(
            Summary = "Liste des associations",
            Description = "Retourne la liste de toutes les associations"
        )]
        [SwaggerResponse(StatusCodes.Status200OK, "Liste des associations trouvée", typeof(IEnumerable<AssociationDTO>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Aucune association trouvée")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssociationDTO>>> GetAssociations()
        {
            // Récupérer toutes les associations avec leurs entités associées (Personne et Element)
            var associationsDTO = await _context.Associations
                .Include(a => a.Personne)  // Inclure l'entité Personne liée à l'association
                .Include(a => a.Element)   // Inclure l'entité Element liée à l'association
                .Select(a => new AssociationDTO(a))  // Convertir en DTO
                .ToListAsync();

            // Retourner la liste d'associations ou une liste vide si aucune n'est trouvée
            return Ok(associationsDTO.Any() ? associationsDTO : new List<AssociationDTO>());
        }

        // GET: api/association/{id}
        // Récupère une association par son identifiant
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
            // Chercher l'association par ID et inclure ses entités associées
            var associationDTO = await _context
                .Associations
                .Include(a => a.Personne)  // Inclure Personne associée
                .Include(a => a.Element)   // Inclure Element associé
                .Where(a => a.Id == id)
                .Select(a => new AssociationDTO(a))
                .SingleOrDefaultAsync();

            // Retourner l'association trouvée ou un objet vide si non trouvé
            return Ok(associationDTO ?? new AssociationDTO());
        }

        // GET: api/association/personne/{personneId}/element/{elementId}
        // Vérifie si une personne est associée à un élément
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
            // Recherche de l'association entre la personne et l'élément
            var association = await _context.Associations
                .Where(a => a.PersonneId == personneId && a.ElementId == elementId)
                .FirstOrDefaultAsync();

            // Si l'association est trouvée, retourner un DTO avec les informations
            if (association != null)
            {
                var estAssocieDTO = new EstAssocieDTO(
                    association.PersonneId,
                    association.ElementId,
                    association.Id
                );
                return Ok(estAssocieDTO);
            }

            // Si l'association n'est pas trouvée, retourner un DTO avec "estAssocie" à false
            var estAssocieDTONotFound = new EstAssocieDTO(personneId, elementId, 0);
            return Ok(estAssocieDTONotFound);
        }

        // POST: api/association
        // Ajoute une nouvelle association
        [SwaggerOperation(
            Summary = "Ajout d'une nouvelle association",
            Description = "Ajoute une nouvelle association à la base de données"
        )]
        [SwaggerResponse(StatusCodes.Status200OK, "Association ajoutée", typeof(AssociationDTO))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Association non ajoutée")]
        [HttpPost]
        public async Task<ActionResult<AssociationDTO>> PostAssociation(AssociationDTO associationDTO)
        {
            // Créer une nouvelle instance d'Association à partir du DTO
            Association association = new Association(associationDTO);
            _context.Associations.Add(association);  // Ajouter l'association à la base
            await _context.SaveChangesAsync();  // Sauvegarder les changements

            // Retourner l'association ajoutée avec son ID
            return CreatedAtAction(
                nameof(GetAssociationById),
                new { id = association.Id },
                new AssociationDTO(association)
            );
        }

        // PUT: api/association/{id}
        // Modifie une association existante
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
            // Vérification que l'ID de l'association correspond à celui de la DTO
            if (id != associationDTO.Id)
                return BadRequest();

            // Mettre à jour l'association en utilisant le DTO
            Association association = new Association(associationDTO);
            _context.Entry(association).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();  // Sauvegarder les modifications
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Associations.Any(a => a.Id == id))  // Vérifier si l'association existe toujours
                    return Ok(new AssociationDTO());  // Retourner un objet vide si l'association n'existe pas
                else
                    throw;
            }

            return Ok(associationDTO);
        }

        // DELETE: api/association/{id}
        // Supprime une association par son identifiant
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
            // Chercher l'association dans la base de données par son ID
            var association = await _context.Associations.FindAsync(id);

            // Si l'association n'est pas trouvée, retourner un objet vide
            if (association == null)
                return Ok(new AssociationDTO());

            // Supprimer l'association et sauvegarder les changements
            _context.Associations.Remove(association);
            await _context.SaveChangesAsync();

            return Ok();  // Retourner une réponse OK après suppression
        }

        // GET: api/association/news/{personneId}
        // Récupère les notifications liées aux événements pour une personne donnée
        [HttpGet("news/{personneId}")]
        public async Task<ActionResult<IEnumerable<NewsDTO>>> GetNews(int personneId)
        {
            // Récupérer les événements auxquels la personne est inscrite
            var evenementsPersonne = await _context.Associations
                .Where(a => a.PersonneId == personneId && a.Type == TypeAssociation.Inscription)
                .Select(a => a.ElementId)
                .Distinct()
                .ToListAsync();

            if (evenementsPersonne == null || !evenementsPersonne.Any())
            {
                return Ok(new List<NewsDTO>());
            }

            var today = DateTime.Today;

            // Récupérer les notifications pour les événements de la personne
            var notificationsElements = await _context.Elements
                .Where(e => e.AssociationAUnElement.HasValue && evenementsPersonne.Contains(e.AssociationAUnElement.Value))
                .Where(e => e.Date == today)
                .Select(e => e.Id)
                .ToListAsync();

            // Récupérer les associations liées aux notifications
            var associations = await _context.Associations
                .Where(a => notificationsElements.Contains(a.ElementId) && a.PersonneId != personneId)
                .Include(a => a.Personne)
                .Include(a => a.Element)
                .ToListAsync();

            // Mapper les résultats en NewsDTO
            var newsDTO = associations.Select(a => new NewsDTO(a)).ToList();

            // Récupérer d'autres événements où la personne est inscrite
            var otherNews = await _context.Associations
                .Where(a => evenementsPersonne.Contains(a.ElementId) && a.Type == TypeAssociation.Inscription && a.PersonneId != personneId)
                .Where(a => a.Date >= today)
                .Include(a => a.Personne)
                .Include(a => a.Element)
                .ToListAsync();

            var additionalNewsDTO = otherNews.Select(a => new NewsDTO(a)).ToList();

            // Fusionner les notifications et autres événements
            var allNews = newsDTO.Concat(additionalNewsDTO).ToList();

            return Ok(allNews);
        }

        // GET: api/association/reservations
        // Récupère toutes les réservations sous forme de NewsDTO
        [HttpGet("news/reservations")]
        public async Task<ActionResult<IEnumerable<NewsDTO>>> GetResa()
        {
            var news = await _context.Associations
                .Where(a => a.Type == TypeAssociation.Reservation)
                .Include(a => a.Personne)
                .Include(a => a.Element)
                .ToListAsync();

            var newsDTO = news.Select(a => new NewsDTO(a)).ToList();
            return Ok(newsDTO);
        }

        // GET: api/association/events/{eventId}/notifications
        // Récupère les notifications associées à un événement spécifique
        [HttpGet("events/{eventId}/notifications")]
        public async Task<ActionResult<IEnumerable<NewsDTO>>> GetNotificationsByEventId(int eventId)
        {
            var notifications = await _context.Elements
                .Where(e => e.Type == TypeElement.Notif && e.AssociationAUnElement == eventId)
                .ToListAsync();

            if (notifications == null || !notifications.Any())
            {
                return Ok(new List<NewsDTO>());
            }

            var associations = await _context.Associations
                .Where(a => notifications.Select(n => n.Id).Contains(a.ElementId))
                .Include(a => a.Personne)
                .Include(a => a.Element)
                .ToListAsync();

            var newsDTO = associations.Select(a => new NewsDTO(a)).ToList();
            return Ok(newsDTO);
        }

        // GET: api/association/notifications/notifs-simples
        // Récupère les notifications simples (sans élément associé)
        [HttpGet("notifications/notifs-simple")]
        public async Task<ActionResult<IEnumerable<NewsDTO>>> GetNotificationsWithoutElementAssociation()
        {
            var notifications = await _context.Elements
                .Where(e => e.Type == TypeElement.Notif && e.AssociationAUnElement == null)
                .ToListAsync();

            if (notifications == null || !notifications.Any())
            {
                return Ok(new List<NewsDTO>());
            }

            var associations = await _context.Associations
                .Where(a => notifications.Select(n => n.Id).Contains(a.ElementId))
                .Include(a => a.Personne)
                .Include(a => a.Element)
                .ToListAsync();

            var newsDTO = associations.Select(a => new NewsDTO(a)).ToList();
            return Ok(newsDTO);
        }

        // GET: api/association/attributions/personne/{personneId}
        // Récupère les attributions pour une personne
        [HttpGet("attributions")]
        public async Task<ActionResult<IEnumerable<NewsDTO>>> GetAttributions()
        {
            var associations = await _context.Associations
                .Where(a => a.Type == TypeAssociation.Attribution)
                .Include(a => a.Element)
                .Include(a => a.Personne)
                .ToListAsync();

            if (associations == null || !associations.Any())
            {
                return Ok(new List<NewsDTO>());
            }

            var newsDTO = associations
                .Where(a => a.Element?.Type == TypeElement.Task)
                .Select(a => new NewsDTO(a))
                .ToList();

            return Ok(newsDTO);
        }
    }
}
