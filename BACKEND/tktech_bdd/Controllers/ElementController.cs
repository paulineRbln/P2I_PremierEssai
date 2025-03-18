using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tktech_bdd.Model;
using tktech_bdd.Dto;
using Swashbuckle.AspNetCore.Annotations;

namespace tktech_bdd.Controllers;

[ApiController]
[Route("api/element")]
public class ElementController : ControllerBase
{
    private readonly ProjetContext _context;

    public ElementController(ProjetContext context)
    {
        _context = context;
    }

    // GET: api/element
    [SwaggerOperation(
        Summary = "Liste des éléments",
        Description = "Retourne la liste de tous les éléments"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Liste des éléments trouvée", typeof(IEnumerable<ElementDTO>))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Aucun élément trouvé")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ElementDTO>>> GetElements()
    {
        var elementsDTO = await _context.Elements.Select(x => new ElementDTO(x)).ToListAsync();
        if (elementsDTO == null || !elementsDTO.Any())
        {
            return Ok(new List<ElementDTO>()); // Retourne un tableau vide si aucun élément n'est trouvé
        }
        return Ok(elementsDTO);
    }

    // GET: api/element/{id}
    [SwaggerOperation(
        Summary = "Élément grâce à identifiant",
        Description = "Retourne un élément à partir de son identifiant"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Élément trouvé", typeof(ElementDTO))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Élément non trouvé")]
    [HttpGet("{id}")]
    public async Task<ActionResult<ElementDTO>> GetElementById(
        [FromRoute, SwaggerParameter(Description = "Identifiant de l'élément (doit être un entier)")]
            int id
    )
    {
        var elementDTO = await _context
            .Elements.Where(e => e.Id == id)
            .Select(element => new ElementDTO(element))
            .SingleOrDefaultAsync();

        if (elementDTO == null)
        {
            return Ok(new ElementDTO()); // Retourne un objet vide si l'élément n'est pas trouvé
        }

        return Ok(elementDTO);
    }

    // POST: api/element
    [SwaggerOperation(
        Summary = "Ajout d'un nouvel élément",
        Description = "Ajoute un nouvel élément à la base de données"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Élément ajouté", typeof(ElementDTO))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Élément non ajouté")]
    [HttpPost]
    public async Task<ActionResult<ElementDTO>> PostElement(ElementDTO elementDTO)
    {
        Element element = new Element(elementDTO);
        _context.Elements.Add(element);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetElementById),
            new { id = element.Id },
            new ElementDTO(element)
        );
    }

    // PUT: api/element/{id}
    [SwaggerOperation(
        Summary = "Modifier un élément",
        Description = "Modifie un élément à partir de son identifiant"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Élément modifié", typeof(ElementDTO))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Élément non modifié")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutElement(
        [FromRoute, SwaggerParameter(Description = "Identifiant de l'élément (doit être un entier)")]
            int id,
        ElementDTO elementDTO
    )
    {
        if (id != elementDTO.Id)
            return BadRequest();

        var element = new Element(elementDTO);
        _context.Entry(element).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Elements.Any(e => e.Id == id))
                return Ok(new ElementDTO()); // Retourne un objet vide si l'élément n'existe pas
            else
                throw;
        }

        return Ok(elementDTO);
    }

    // DELETE: api/element/{id}
    [SwaggerOperation(
        Summary = "Supprimer un élément et toutes ses associations",
        Description = "Supprime un élément ainsi que toutes les associations qui lui sont liées"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Élément et associations supprimés")]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Élément ou associations non trouvés")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteElementWithAssociations(
        [FromRoute, SwaggerParameter(Description = "Identifiant de l'élément (doit être un entier)")]
            int id
    )
    {
        // Rechercher l'élément à supprimer
        var element = await _context.Elements.FindAsync(id);

        if (element == null)
        {
            // Retourne un objet vide si l'élément n'est pas trouvé
            return NotFound();
        }

        // Supprimer toutes les associations liées à cet élément
        var associations = await _context.Associations.Where(a => a.ElementId == id).ToListAsync();
        if (associations.Any())
        {
            _context.Associations.RemoveRange(associations); // Supprimer toutes les associations
        }

        // Supprimer l'élément
        _context.Elements.Remove(element);

        // Sauvegarder les changements dans la base de données
        await _context.SaveChangesAsync();

        // Retourner une réponse de succès
        return Ok(new { message = "Élément et associations supprimés avec succès" });
    }


    // GET: api/element/personne/{personneId}
    [SwaggerOperation(
        Summary = "Liste des éléments associés à une personne",
        Description = "Retourne la liste des éléments qui sont associés à une personne via les associations"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Liste des éléments trouvée", typeof(IEnumerable<ElementDTO>))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Aucun élément trouvé pour cette personne")]
    [HttpGet("personne/{personneId}")]
    public async Task<ActionResult<IEnumerable<ElementDTO>>> GetElementsByPersonneId(
        [FromRoute] int personneId
    )
    {
        // Filtrer les éléments associés à la personne via l'entité Association
        var elementsDTO = await _context.Associations
            .Where(a => a.PersonneId == personneId) // Filtrer par l'ID de la personne
            .Include(a => a.Element) // Inclure l'élément associé
            .Select(a => new ElementDTO(a.Element)) // Convertir l'élément en DTO
            .ToListAsync();

        if (elementsDTO == null || elementsDTO.Count == 0)
        {
            return Ok(new List<ElementDTO>()); // Retourner un tableau vide si aucun élément n'est trouvé
        }

        return Ok(elementsDTO); // Retourner la liste des éléments sous forme de DTO
    }


    // PUT: api/element/{id}/estFait
    [SwaggerOperation(
        Summary = "Modifier la propriété estFait d'un élément",
        Description = "Modifie uniquement la propriété estFait d'un élément à partir de son identifiant"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Propriété estFait modifiée", typeof(ElementDTO))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Élément non trouvé")]
    [HttpPut("{id}/{estFait}")]
    public async Task<IActionResult> PutEstFait(
        [FromRoute, SwaggerParameter(Description = "Identifiant de l'élément (doit être un entier)")] int id,
        [FromRoute, SwaggerParameter(Description = "Nouveau statut de la propriété estFait")] bool estFait
    )
    {
        var element = await _context.Elements.FindAsync(id);

        if (element == null)
        {
            return NotFound(); // Retourne un 404 si l'élément n'est pas trouvé
        }

        // Mise à jour de la propriété estFait
        element.EstFait = estFait;

        _context.Entry(element).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Elements.Any(e => e.Id == id))
            {
                return NotFound(); // Retourne 404 si l'élément n'existe plus
            }
            else
            {
                throw; // Lance l'exception si une autre erreur se produit
            }
        }

        // Retourne l'élément mis à jour sous forme de DTO
        return Ok(new ElementDTO(element));
    }
}
