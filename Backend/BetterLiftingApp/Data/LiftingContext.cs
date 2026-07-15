using BetterLiftingApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BetterLiftingApp.Data
{
    public class LiftingContext : IdentityDbContext<IdentityUser>
    {
        public LiftingContext(DbContextOptions<LiftingContext> options) : base(options) {}
        public DbSet<Exercise> Exercises {get; set;} 
        public DbSet<MuscleGroup> MuscleGroups {get; set;}
        public DbSet<Workout> Workouts {get; set;}
        public DbSet<WorkoutExercise> WorkoutExercises {get; set;}
        public DbSet<WorkoutSet> WorkoutSets {get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Seed Muscle Groups
            modelBuilder.Entity<MuscleGroup>().HasData(SeedData.MuscleGroups);

            // Exercises is many-to-many but we dont need the pointer from musclegroups back to exercise
            modelBuilder.Entity<Exercise>()
            .HasMany(e => e.MuscleGroups)
            .WithMany(); // unidirectional 

            modelBuilder.Entity<WorkoutSet>().Property(e => e.Weight).HasPrecision(5,2);    

        }

    }
}