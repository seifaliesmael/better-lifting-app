namespace BetterLiftingApp.Models
{
    public class WorkoutSet
    {
        public int Id {get; set;}

        public int WorkoutExerciseId {get; set;}
        public WorkoutExercise WorkoutExercise {get; set;} = null!;
        public int Order {get; set;}
        public decimal Weight {get; set;}
        public int Reps {get; set;}
        public SetType Type {get; set;}
        public int? RIR {get; set;}
    }

    public enum SetType {Warmup, RegularSet, DropSet}
    
}