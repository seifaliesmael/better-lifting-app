namespace BetterLiftingApp.Models
{
    public class WorkoutExercise
    {
        public int Id {get; set;}
        public int Order {get; set;}
        public Workout Workout {get; set;} = null!;
        public Exercise Exercise {get; set;} = null!;
        public List<WorkoutSet> Sets {get; set;} = new();
    }
    
}