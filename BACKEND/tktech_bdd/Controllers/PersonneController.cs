using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tktech_bdd.Model;
using tktech_bdd.Dto;
using Microsoft.IdentityModel.Tokens;  // Pour les classes de gestion des tokens
using System.IdentityModel.Tokens.Jwt;  // Pour JwtSecurityTokenHandler et JwtSecurityToken
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Swashbuckle.AspNetCore.Annotations;

namespace tktech_bdd.Controllers;

[ApiController]
[Route("api/personne")]
public class PersonneController : ControllerBase
{
    private readonly ProjetContext _context;
    private readonly IConfiguration _configuration; // Déclarez cette variable

    // Injectez IConfiguration dans le constructeur du contrôleur
    public PersonneController(ProjetContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration; // Initialisez _configuration
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

        // Ajoutez la personne à la base de données
        _context.Personnes.Add(personne);
        await _context.SaveChangesAsync();

        // Créez un Score pour cette nouvelle personne
        var score = new Score
        {
            PersonneId = personne.Id // Lier le score à la personne en utilisant son ID
        };

        // Ajoutez le score à la base de données
        _context.Scores.Add(score);
        await _context.SaveChangesAsync();

        // Retourner l'objet personne après la création
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
        Description = "Supprime une personne à partir de son identifiant et toutes ses associations"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Personne et ses associations supprimées")]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Personne non trouvée")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePersonne(
        [FromRoute, SwaggerParameter(Description = "Identifiant de la personne (doit être un entier)")]
            int id
    )
    {
        // Récupérer la personne à supprimer
        var personne = await _context.Personnes.FindAsync(id);

        if (personne == null)
            return NotFound();

        // Supprimer le score associé à cette personne
        var score = await _context.Scores.FirstOrDefaultAsync(s => s.PersonneId == id);
        if (score != null)
        {
            _context.Scores.Remove(score);
        }

        // Supprimer toutes les associations liées à cette personne
        var associations = await _context.Associations
            .Where(a => a.PersonneId == id)
            .ToListAsync();

        _context.Associations.RemoveRange(associations);

        // Supprimer la personne
        _context.Personnes.Remove(personne);

        // Sauvegarder les changements dans la base de données
        await _context.SaveChangesAsync();

        return Ok();
    }


    // POST: api/personne/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var personne = await _context.Personnes
            .FirstOrDefaultAsync(p => p.Pseudo == request.Pseudo);

        if (personne == null || personne.MotDePasse != request.MotDePasse)
        {
            return Unauthorized(new { message = "Identifiants invalides" });
        }

        var token = GenerateJwtToken(personne);

        return Ok(new { token, id = personne.Id });    }

    private string GenerateJwtToken(Personne personne)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, personne.Pseudo),
            new Claim(ClaimTypes.NameIdentifier, personne.Id.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

    

    

