using BetterLiftingApp.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.Services.AddDbContext<LiftingContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnection"))
); // DB Context for Data

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = false)
.AddEntityFrameworkStores<LiftingContext>(); // Add automatic identity and auth services to the db context.

builder.Services.ConfigureApplicationCookie(options =>
{
    // Allow auth cookie to be sent to a different site (frontend)
   options.Cookie.SameSite = SameSiteMode.None; 
   
   // Cookie is only sent over HTTPS (encrypted)
   options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services.AddAutoMapper(typeof(Program));

// Fetch frontend and mobile IPs
string[] allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(",") ?? [];

// CORS so Front-end can access data
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
    policy =>
    {
        policy.WithOrigins(allowedOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

app.MapGroup("/api/auth").MapIdentityApi<IdentityUser>(); // Adds identity endpoints

// Add logout endpoint
app.MapPost("/api/auth/logout", async (SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    return Results.Ok();
}).RequireAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection(); TODO: Add HTTPS back

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();
app.Run();
