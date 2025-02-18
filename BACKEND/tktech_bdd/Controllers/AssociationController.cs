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

            // Récupérer toutes les inscriptions et réservations pour ces événements, mais exclure ceux où la personne est inscrite
            var news = await _context.Associations
                .Where(a => (evenementsPersonne.Contains(a.ElementId) && a.Type == TypeAssociation.Inscription && a.PersonneId != personneId) // Exclure les événements où la personne est inscrite
                            || (a.Type == TypeAssociation.Reservation && a.PersonneId != personneId)) // Exclure les réservations faites par la personne elle-même
                .Include(a => a.Personne)  // Inclure les informations de la personne
                .Include(a => a.Element)   // Inclure les informations de l'élément (événement)
                .ToListAsync();

            // Mapper les résultats en NewsDTO
            var newsDTO = news.Select(a => new NewsDTO(a)).ToList();

            return Ok(newsDTO);
        }
    }
}
