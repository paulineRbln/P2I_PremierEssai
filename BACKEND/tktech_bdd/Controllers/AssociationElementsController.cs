using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tktech_bdd.Model;
using tktech_bdd.Dto;

namespace tktech_bdd.Controllers
{
    [ApiController]
    [Route("api/associationElements")]
    public class AssociationElementsController : ControllerBase
    {
        private readonly ProjetContext _context;

        public AssociationElementsController(ProjetContext context)
        {
            _context = context;
        }

        // POST: api/association-elements
        [HttpPost]
        public async Task<ActionResult<AssociationElementsDTO>> CreateAssociation(AssociationElementsDTO associationElementsDTO)
        {
            var associationElements = new AssociationElements(associationElementsDTO);
            _context.AssociationsElements.Add(associationElements);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAssociationById), new { id = associationElements.Id }, new AssociationElementsDTO(associationElements));
        }

        // GET: api/association-elements/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AssociationElementsDTO>> GetAssociationById(int id)
        {
            var associationElements = await _context.AssociationsElements
                .Include(a => a.Element1)
                .Include(a => a.Element2)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (associationElements == null)
            {
                return NotFound();
            }

            return Ok(new AssociationElementsDTO(associationElements));
        }

        // GET: api/association-elements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssociationElementsDTO>>> GetAllAssociations()
        {
            var associations = await _context.AssociationsElements
                .Include(a => a.Element1)
                .Include(a => a.Element2)
                .ToListAsync();

            return Ok(associations.Select(a => new AssociationElementsDTO(a)).ToList());
        }

        // DELETE: api/association-elements/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssociation(int id)
        {
            var associationElements = await _context.AssociationsElements.FindAsync(id);

            if (associationElements == null)
            {
                return NotFound();
            }

            _context.AssociationsElements.Remove(associationElements);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}