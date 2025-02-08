using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tktech_bdd.Model;
using tktech_bdd.Dto;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace tktech_bdd.Controllers
{
    [ApiController]
    [Route("api/recurrence")]
    public class RecurrenceController : ControllerBase
    {
        private readonly ProjetContext _context;

        public RecurrenceController(ProjetContext context)
        {
            _context = context;
        }

        // GET: api/recurrence
        [SwaggerOperation(
            Summary = "Liste des recurrences",
            Description = "Retourne la liste de toutes les recurrences"
        )]
        [SwaggerResponse(StatusCodes.Status200OK, "Liste des recurrences trouvée", typeof(IEnumerable<RecurrenceDTO>))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Aucune recurrence trouvée")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecurrenceDTO>>> GetRecurrences()
        {
            var recurrencesDTO = await _context.Recurrences
                .Include(r => r.Element)  // Inclure les entités associées (Element)
                .Select(r => new RecurrenceDTO(r))  // Convertir en DTO
                .ToListAsync();

            return recurrencesDTO;
        }

        // GET: api/recurrence/{id}
        [SwaggerOperation(
            Summary = "Récurrence grâce à identifiant",
            Description = "Retourne une recurrence à partir de son identifiant"
        )]
        [SwaggerResponse(StatusCodes.Status200OK, "Récurrence trouvée", typeof(RecurrenceDTO))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Récurrence non trouvée")]
        [HttpGet("{id}")]
        public async Task<ActionResult<RecurrenceDTO>> GetRecurrenceById(
            [FromRoute, SwaggerParameter(Description = "Identifiant de la recurrence (doit être un entier)")]
                int id
        )
        {
            var recurrenceDTO = await _context
                .Recurrences
                .Include(r => r.Element)  // Inclure les entités associées
                .Where(r => r.Id == id)
                .Select(r => new RecurrenceDTO(r))
                .SingleOrDefaultAsync();

            if (recurrenceDTO == null)
                return NotFound();

            return recurrenceDTO;
        }

        // POST: api/recurrence
        [SwaggerOperation(
            Summary = "Ajout d'une nouvelle recurrence",
            Description = "Ajoute une nouvelle recurrence à la base de données"
        )]
        [SwaggerResponse(StatusCodes.Status200OK, "Récurrence ajoutée", typeof(RecurrenceDTO))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Récurrence non ajoutée")]
        [HttpPost]
        public async Task<ActionResult<RecurrenceDTO>> PostRecurrence(RecurrenceDTO recurrenceDTO)
        {
            // Créer une nouvelle instance de Recurrence en utilisant le DTO
            Recurrence recurrence = new Recurrence(recurrenceDTO);
            _context.Recurrences.Add(recurrence);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetRecurrenceById),
                new { id = recurrence.Id },
                new RecurrenceDTO(recurrence)
            );
        }

        // PUT: api/recurrence/{id}
        [SwaggerOperation(
            Summary = "Modifier une recurrence",
            Description = "Modifie une recurrence à partir de son identifiant"
        )]
        [SwaggerResponse(StatusCodes.Status200OK, "Récurrence modifiée", typeof(RecurrenceDTO))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Récurrence non modifiée")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecurrence(
            [FromRoute, SwaggerParameter(Description = "Identifiant de la recurrence (doit être un entier)")]
                int id,
            RecurrenceDTO recurrenceDTO
        )
        {
            if (id != recurrenceDTO.Id)
                return BadRequest();

            // Mettre à jour la recurrence
            Recurrence recurrence = new Recurrence(recurrenceDTO);
            _context.Entry(recurrence).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Recurrences.Any(r => r.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return Ok(recurrenceDTO);
        }

        // DELETE: api/recurrence/{id}
        [SwaggerOperation(
            Summary = "Supprimer une recurrence",
            Description = "Supprime une recurrence définitivement"
        )]
        [SwaggerResponse(StatusCodes.Status200OK, "Récurrence supprimée", typeof(RecurrenceDTO))]
        [SwaggerResponse(StatusCodes.Status404NotFound, "Récurrence non supprimée")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecurrence(
            [FromRoute, SwaggerParameter(Description = "Identifiant de la recurrence (doit être un entier)")]
                int id
        )
        {
            var recurrence = await _context.Recurrences.FindAsync(id);

            if (recurrence == null)
                return NotFound();

            _context.Recurrences.Remove(recurrence);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
