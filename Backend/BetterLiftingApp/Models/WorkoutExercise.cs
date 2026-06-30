namespace BetterLiftingApp.Models
{
    public class WorkoutExercise
    {
        public int Id {get; set;}
        public int Order {get; set;}

        public int WorkoutId {get; set;}
        public Workout Workout {get; set;} = null!;

        public int ExerciseId {get; set;}
        public Exercise Exercise {get; set;} = null!;
        public List<WorkoutSet> WorkoutSets {get; set;} = new();
    }
    
}