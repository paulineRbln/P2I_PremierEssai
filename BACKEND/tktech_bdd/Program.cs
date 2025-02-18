using Microsoft.EntityFrameworkCore;
using tktech_bdd.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Ajouter les services nécessaires à l'application
builder.Services.AddControllers();

// Ajouter Swagger (optionnel)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ProjetContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Ajouter la configuration pour l'authentification JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!))
        };
    });

// Ajouter la configuration de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Autoriser les requêtes venant de ton frontend React
              .AllowAnyMethod()  // Autoriser toutes les méthodes HTTP (GET, POST, etc.)
              .AllowAnyHeader(); // Autoriser tous les en-têtes
    });
});

// Configurer Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.EnableAnnotations();
});

var app = builder.Build();

// Appliquer la politique CORS
app.UseCors("AllowReactApp");

// Activer Swagger en mode développement
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Utiliser l'authentification et l'autorisation
app.UseAuthentication();
app.UseAuthorization();

// Mapper les contrôleurs
app.MapControllers();

// Initialiser les données
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ProjetContext>();
    SeedData.Initialize(context);  // Passer le ProjetContext à SeedData.Initialize
}

app.Run();
