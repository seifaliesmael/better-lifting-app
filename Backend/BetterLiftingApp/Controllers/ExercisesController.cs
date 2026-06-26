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

        [HttpGet]
        public async Task<ActionResult<List<Exercise>>> GetAllExercises()
        {
            Console.WriteLine("Received a get all request at Exercises");
            List<Exercise> exercises = await context.Exercises.Include(e => e.MuscleGroups).ToListAsync();
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
        public async Task<ActionResult<Exercise>> AddExercise(ExerciseCreateData newEx)
        {
            Console.WriteLine($"Received a post request for new exercise");

            if (newEx == null) return BadRequest();

            List<MuscleGroup> muscleGroups = await context.MuscleGroups.Where(e => newEx.MuscleGroupIDs.Contains(e.Id)).ToListAsync();
            
            Exercise ex = new Exercise
            {
                ExerciseName = newEx.ExerciseName,
                MuscleGroups = muscleGroups,
                EquipmentType = newEx.EquipmentType
            };
            context.Exercises.Add(ex);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExercise), new {id = ex.Id}, ex);
        }
    }

    public class ExerciseCreateData
    {
        public string ExerciseName {get; set;} = null!;
        public List<int> MuscleGroupIDs {get; set;} = new();
        public Equipment EquipmentType {get; set;}
    }
}