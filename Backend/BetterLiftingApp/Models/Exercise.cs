namespace BetterLiftingApp.Models
{
    public class Exercise
    {
        public int Id {get; set;}
        public string ExerciseName {get; set;} = null!;
        public List<MuscleGroup> MuscleGroups {get; set;} = new();
        public Equipment EquipmentType {get; set;}
    }

    public enum Equipment
    { Dumbbell, StraightBar, Barbell, Machine, Cable, Bodyweight }
}