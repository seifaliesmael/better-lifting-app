using BetterLiftingApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace BetterLiftingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExercisesController : ControllerBase
    {
        static private List<Exercise> exercises = new List<Exercise>
        {
            new Exercise
            {
                Id = 1,
                ExerciseName = "Exercise One"
            },
            new Exercise
            {
                Id = 2,
                ExerciseName = "Exercise Two"
            },  
            new Exercise
            {
                Id = 3,
                ExerciseName = "Exercise Three"
            },  
        };

        [HttpGet]
        public ActionResult<List<Exercise>> GetAllExercises()
        {
            Console.WriteLine("Received a get request.");
            return Ok(exercises);
        }
    }
}