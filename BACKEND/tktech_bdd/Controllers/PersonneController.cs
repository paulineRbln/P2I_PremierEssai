using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tktech_bdd.Model;
using tktech_bdd.Dto;
using Swashbuckle.AspNetCore.Annotations;

namespace tktech_bdd.Controllers;

[ApiController]
[Route("api/personne")]
public class PersonneController : ControllerBase
{
    private readonly ProjetContext _context;

    public PersonneController(ProjetContext context)
    {
        _context = context;
    }

    // GET: api/personne
    [SwaggerOperation(
        Summary = "Liste des personnes",
        Description = "Retourne la liste de toutes les personnes"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Liste des personnes trouvée", typeof(IEnumerable<PersonneDTO>))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Aucune personne trouvée")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PersonneDTO>>> GetPersonnes()
    {
        var personnesDTO = await _context.Personnes.Select(x => new PersonneDTO(x)).ToListAsync();
        return personnesDTO;
    }

    // GET: api/personne/{id}
    [SwaggerOperation(
        Summary = "Personne par identifiant",
        Description = "Retourne une personne à partir de son identifiant"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Personne trouvée", typeof(PersonneDTO))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Personne non trouvée")]
    [HttpGet("{id}")]
    public async Task<ActionResult<PersonneDTO>> GetPersonneById(
        [FromRoute, SwaggerParameter(Description = "Identifiant de la personne (doit être un entier)")]
            int id
    )
    {
        var personne = await _context.Personnes.FindAsync(id);

        if (personne == null)
            return NotFound();

        return new PersonneDTO(personne);
    }

    // POST: api/personne
    [SwaggerOperation(
        Summary = "Ajouter une personne",
        Description = "Ajoute une personne avec les informations fournies"
    )]
    [SwaggerResponse(StatusCodes.Status201Created, "Personne ajoutée", typeof(PersonneDTO))]
    [SwaggerResponse(StatusCodes.Status400BadRequest, "Données invalides")]
    [HttpPost]
    public async Task<ActionResult<Personne>> PostPersonne(Personne personne)
    {
        if (personne == null)
            return BadRequest("Les données de la personne sont invalides.");

        _context.Personnes.Add(personne);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPersonneById), new { id = personne.Id }, personne);
    }

    // PUT: api/personne/{id}
    [SwaggerOperation(
        Summary = "Modifier une personne",
        Description = "Modifie une personne existante"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Personne modifiée", typeof(PersonneDTO))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Personne non trouvée")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutPersonne(
        [FromRoute, SwaggerParameter(Description = "Identifiant de la personne (doit être un entier)")]
            int id,
        Personne personne
    )
    {
        if (id != personne.Id)
            return BadRequest();

        _context.Entry(personne).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Personnes.Any(p => p.Id == id))
                return NotFound();
            else
                throw;
        }

        return Ok(personne);
    }

    // DELETE: api/personne/{id}
    [SwaggerOperation(
        Summary = "Supprimer une personne",
        Description = "Supprime une personne à partir de son identifiant"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Personne supprimée")]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Personne non trouvée")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePersonne(
        [FromRoute, SwaggerParameter(Description = "Identifiant de la personne (doit être un entier)")]
            int id
    )
    {
        var personne = await _context.Personnes.FindAsync(id);

        if (personne == null)
            return NotFound();

        _context.Personnes.Remove(personne);
        await _context.SaveChangesAsync();

        return Ok();
    }
}
