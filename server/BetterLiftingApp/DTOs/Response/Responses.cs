namespace BetterLiftingApp.DTOs.Response
{
    public class WOResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Notes { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public List<WOExResponse> WorkoutExercises { get; set; } = [];
    }

    public class WOExResponse
    {
        public int Id { get; set; }
        public string? ExerciseName {get; set;} = null!;
        public int Order { get; set; }
        public int ExerciseId { get; set; }
        
        public List<WOSetResponse> WorkoutSets { get; set; } = [];
    }
    public class WOSetResponse
    {
        public int Id { get; set; }
        public int Order { get; set; }
        public decimal Weight { get; set; }
        public int Reps { get; set; }
        public SetType Type { get; set; } 
        public int? RIR { get; set; }
    }

    public enum SetType {Warmup, RegularSet, DropSet}

}