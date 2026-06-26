namespace BetterLiftingApp.Models
{
    public class Workout
    {
        public int Id {get; set;}
        public int UserID {get; set;}
        public String? Notes {get; set;}
        public DateTime Start {get; set;}
        public DateTime End {get; set;}

    }
    
}