using BetterLiftingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BetterLiftingApp.Data
{
    public class LiftingContext : DbContext
    {
        public LiftingContext(DbContextOptions<LiftingContext> options) : base(options) {}
        public DbSet<Exercise> Exercises {get; set;} 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed data
            modelBuilder.Entity<Exercise>().HasData(
                new Exercise
                {
                    id = 1,
                    exerciseName = "Seed Exercise One"
                },
                new Exercise
                {
                    id = 2,
                    exerciseName = "Seed Exercise Two"
                }
            );
        }

    }
}