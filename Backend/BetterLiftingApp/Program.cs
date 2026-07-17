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
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
); // DB Context for Data

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = false)
.AddEntityFrameworkStores<LiftingContext>(); // Add automatic identity and auth services to the db context.

builder.Services.AddAutoMapper(typeof(Program));

// CORS so Front-end can access data
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalDev",
    policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:8081") // TODO: separate front-end port to config
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

app.UseCors("AllowLocalDev");
app.UseAuthorization();
app.MapControllers();
app.Run();
