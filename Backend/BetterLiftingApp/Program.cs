using BetterLiftingApp.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.Services.AddDbContext<LiftingContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
); // DB Context for Data

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>()
.AddEntityFrameworkStores<LiftingContext>(); // Add automatic identity and auth services to the db context.

// CORS so Front-end can access data
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalDev",
    policy =>
    {
        policy.WithOrigins("http://localhost:5173") // TODO: separate front-end port to config
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});


var app = builder.Build();

app.MapGroup("/api/auth").MapIdentityApi<IdentityUser>(); // Adds identity endpoints

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowLocalDev");
app.MapControllers();
app.Run();
