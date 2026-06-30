namespace BetterLiftingApp.Models
{
    public class Workout
    {
        public int Id {get; set;}
        public string name {get; set;} = null!;
        public int UserId {get; set;}
        public String? Notes {get; set;}
        public DateTime Start {get; set;}
        public DateTime End {get; set;}
        public List<WorkoutExercise> WorkoutExercises {get; set;} = new();
    }
    
}