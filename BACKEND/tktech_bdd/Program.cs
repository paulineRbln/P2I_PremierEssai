using tktech_bdd.Data;

var builder = WebApplication.CreateBuilder(args);
// Ajouter les services nécessaires à l'application
builder.Services.AddControllers();
// Ajouter Swagger (optionnel)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Ajouter le contexte de la base de données
builder.Services.AddDbContext<ProjetContext>();

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

SeedData.Initialize();  // Lancer la méthode d'initialisation des données ici

app.Run();
