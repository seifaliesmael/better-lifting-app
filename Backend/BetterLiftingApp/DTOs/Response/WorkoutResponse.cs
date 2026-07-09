namespace BetterLiftingApp.DTOs.Response
{
    public class WorkoutResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int UserId { get; set; }
        public string? Notes { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public List<WorkoutExerciseResponse> WorkoutExercises { get; set; } = [];
    }

    public class WorkoutExerciseResponse
    {
        public int Id { get; set; }
        public string? Name {get; set;} = null!;
        public int Order { get; set; }
        public int ExerciseId { get; set; }
        
        public List<WorkoutSetResponse> WorkoutSets { get; set; } = [];
    }
    public class WorkoutSetResponse
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