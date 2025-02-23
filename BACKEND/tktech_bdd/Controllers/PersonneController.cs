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

    

    

