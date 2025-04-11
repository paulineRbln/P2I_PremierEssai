using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tktech_bdd.Model;
using tktech_bdd.Dto;
using Microsoft.IdentityModel.Tokens;  // Pour les classes de gestion des tokens
using System.IdentityModel.Tokens.Jwt;  
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Swashbuckle.AspNetCore.Annotations;

namespace tktech_bdd.Controllers;

[ApiController]
[Route("api/personne")]
public class PersonneController : ControllerBase
{
    private readonly ProjetContext _contexte;
    private readonly IConfiguration _configuration;

    // Injectez IConfiguration dans le constructeur du contrôleur
    public PersonneController(ProjetContext contexte, IConfiguration configuration)
    {
        _contexte = contexte;
        _configuration = configuration;
    }

    // GET: api/personne
    // Récupère la liste de toutes les personnes
    [SwaggerOperation(
        Summary = "Liste des personnes",
        Description = "Retourne la liste de toutes les personnes"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Liste des personnes trouvée", typeof(IEnumerable<PersonneDTO>))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Aucune personne trouvée")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PersonneDTO>>> ObtenirPersonnes()
    {
        // Récupère toutes les personnes et les transforme en DTO pour la réponse
        var personnesDTO = await _contexte.Personnes.Select(x => new PersonneDTO(x)).ToListAsync();
        return personnesDTO;
    }

    // GET: api/personne/{id}
    // Récupère une personne par son identifiant
    [SwaggerOperation(
        Summary = "Personne par identifiant",
        Description = "Retourne une personne à partir de son identifiant"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Personne trouvée", typeof(PersonneDTO))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Personne non trouvée")]
    [HttpGet("{id}")]
    public async Task<ActionResult<PersonneDTO>> ObtenirPersonneParId(
        [FromRoute, SwaggerParameter(Description = "Identifiant de la personne (doit être un entier)")]
            int id
    )
    {
        // Recherche la personne par son identifiant
        var personne = await _contexte.Personnes.FindAsync(id);

        if (personne == null)
            return NotFound();

        return new PersonneDTO(personne);
    }

    // POST: api/personne
    // Ajoute une personne dans la base de données
    [SwaggerOperation(
        Summary = "Ajouter une personne",
        Description = "Ajoute une personne avec les informations fournies"
    )]
    [SwaggerResponse(StatusCodes.Status201Created, "Personne ajoutée", typeof(PersonneDTO))]
    [SwaggerResponse(StatusCodes.Status400BadRequest, "Données invalides")]
    [HttpPost]
    public async Task<ActionResult<Personne>> AjouterPersonne(Personne personne)
    {
        if (personne == null)
            return BadRequest("Les données de la personne sont invalides.");

        // Ajoute la personne dans la base de données
        _contexte.Personnes.Add(personne);
        await _contexte.SaveChangesAsync();

        // Crée un score pour cette nouvelle personne
        var score = new Score
        {
            PersonneId = personne.Id // Lier le score à la personne par son ID
        };

        // Ajoute le score dans la base de données
        _contexte.Scores.Add(score);
        await _contexte.SaveChangesAsync();

        // Retourne la personne créée avec son ID
        return CreatedAtAction(nameof(ObtenirPersonneParId), new { id = personne.Id }, personne);
    }

    // PUT: api/personne/{id}
    // Modifie une personne existante
    [SwaggerOperation(
        Summary = "Modifier une personne",
        Description = "Modifie une personne existante"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Personne modifiée", typeof(PersonneDTO))]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Personne non trouvée")]
    [HttpPut("{id}")]
    public async Task<IActionResult> ModifierPersonne(
        [FromRoute, SwaggerParameter(Description = "Identifiant de la personne (doit être un entier)")]
            int id,
        Personne personne
    )
    {
        if (id != personne.Id)
            return BadRequest();

        _contexte.Entry(personne).State = EntityState.Modified;

        try
        {
            await _contexte.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            // Si la personne n'existe pas dans la base, retourne une erreur 404
            if (!_contexte.Personnes.Any(p => p.Id == id))
                return NotFound();
            else
                throw;
        }

        return Ok(personne);
    }

    // DELETE: api/personne/{id}
    // Supprime une personne et ses associations
    [SwaggerOperation(
        Summary = "Supprimer une personne",
        Description = "Supprime une personne à partir de son identifiant et toutes ses associations"
    )]
    [SwaggerResponse(StatusCodes.Status200OK, "Personne et ses associations supprimées")]
    [SwaggerResponse(StatusCodes.Status404NotFound, "Personne non trouvée")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> SupprimerPersonne(
        [FromRoute, SwaggerParameter(Description = "Identifiant de la personne (doit être un entier)")]
            int id
    )
    {
        // Récupère la personne à supprimer
        var personne = await _contexte.Personnes.FindAsync(id);

        if (personne == null)
            return NotFound();

        // Supprime le score associé à cette personne
        var score = await _contexte.Scores.FirstOrDefaultAsync(s => s.PersonneId == id);
        if (score != null)
        {
            _contexte.Scores.Remove(score);
        }

        // Supprime toutes les associations liées à cette personne
        var associations = await _contexte.Associations
            .Where(a => a.PersonneId == id)
            .ToListAsync();

        _contexte.Associations.RemoveRange(associations);

        // Supprime la personne de la base de données
        _contexte.Personnes.Remove(personne);

        // Sauvegarde les changements
        await _contexte.SaveChangesAsync();

        return Ok();
    }

    // POST: api/personne/login
    // Authentifie une personne et retourne un token JWT
    [HttpPost("login")]
    public async Task<IActionResult> Connexion([FromBody] LoginRequest request)
    {
        var personne = await _contexte.Personnes
            .FirstOrDefaultAsync(p => p.Pseudo == request.Pseudo);

        if (personne == null || personne.MotDePasse != request.MotDePasse)
        {
            return Unauthorized(new { message = "Identifiants invalides" });
        }

        var token = GenererJwtToken(personne);

        return Ok(new { token, id = personne.Id, estProprio = personne.EstProprio });
    }

    private string GenererJwtToken(Personne personne)
    {
        // Création des informations (claims) à inclure dans le token JWT
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, personne.Pseudo),
            new Claim(ClaimTypes.NameIdentifier, personne.Id.ToString())
        };

        // Création de la clé secrète pour signer le token
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Création du token JWT
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds
        );

        // Retourne le token sous forme de chaîne
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
