using BetterLiftingApp.Models;

namespace BetterLiftingApp.DTOs.Request
{
    public class ExRequest
    {
        public string ExerciseName {get; set;} = null!;
        public List<int> MuscleGroupIDs {get; set;} = new();
        public Equipment EquipmentType {get; set;}
}

    public class WORequest
    {
        public string Name {get; set;} = null!;
        public string? Notes {get; set;}
        public DateTime Start {get; set;}
        public DateTime End {get; set;}
        public List<WOExRequest> WorkoutExercises {get; set;} = [];
    }

    public class WOExRequest
    {
        public int Order {get; set;}
        public int ExerciseId {get; set;}
        public List<WOSetRequest> WorkoutSets {get; set;} = [];
    }
    public class WOSetRequest
    {
        public int Order {get; set;}
        public int Weight { get; set; }
        public int Reps {get; set;}
        public int Type {get; set;}
        public int? RIR {get; set;}
    }

}