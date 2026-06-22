using BetterLiftingApp.Data;
using BetterLiftingApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BetterLiftingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExercisesController : ControllerBase
    {
        private readonly LiftingContext context;
        public ExercisesController(LiftingContext _context)
        {
            context = _context;
        }

        // static private List<Exercise> exercises = new List<Exercise>
        // {
        //     new Exercise
        //     {
        //         Id = 1,
        //         ExerciseName = "Exercise One"
        //     },
        //     new Exercise
        //     {
        //         Id = 2,
        //         ExerciseName = "Exercise Two"
        //     },  
        //     new Exercise
        //     {
        //         Id = 3,
        //         ExerciseName = "Exercise Three"
        //     },  
        // };

        [HttpGet]
        public async Task<ActionResult<List<Exercise>>> GetAllExercises()
        {
            Console.WriteLine("Received a get all request at Exercises");
            List<Exercise> exercises = await context.Exercises.ToListAsync();
            return Ok(exercises);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Exercise>> GetExercise(int id)
        {
            Console.WriteLine($"Received a get request for id {id}");
            Exercise? exercise = await context.Exercises.FindAsync(id);
            
            if (exercise == null) return NotFound();
            else return Ok(exercise);
        }

        [HttpPost]
        public async Task<ActionResult<Exercise>> AddExercise(Exercise newEx)
        {
            Console.WriteLine($"Received a post request for new exercise");

            if (newEx == null) return BadRequest();

            context.Exercises.Add(newEx);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(AddExercise), new {id = newEx.id}, newEx);
        }
    }
}