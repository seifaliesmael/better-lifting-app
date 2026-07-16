namespace BetterLiftingApp.Models
{
    public class Workout
    {
        public int Id {get; set;}
        public string Name {get; set;} = null!;
        public string UserId {get; set;} = null!;
        public String? Notes {get; set;}
        public DateTime Start {get; set;}
        public DateTime End {get; set;}
        public List<WorkoutExercise> WorkoutExercises {get; set;} = new();
    }
    
}