using BetterLiftingApp.Data;
using BetterLiftingApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BetterLiftingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MuscleGroupsController : ControllerBase
    {
        private readonly LiftingContext context;
        public MuscleGroupsController(LiftingContext _context)
        {
            context = _context;
        }


        [HttpGet]
        public async Task<ActionResult<List<MuscleGroup>>> GetAllMuscleGroups()
        {
            Console.WriteLine("Received a get all request at Muscle Groups");
            List<MuscleGroup> muscleGroups = await context.MuscleGroups.ToListAsync();
            return Ok(muscleGroups);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MuscleGroup>> GetMuscleGroup(int id)
        {
            Console.WriteLine($"Received a get request for id {id}");
            MuscleGroup? muscleGroup = await context.MuscleGroups.FindAsync(id);
            
            if (muscleGroup == null) return NotFound();
            else return Ok(muscleGroup);
        }

        [HttpPost]
        public async Task<ActionResult<MuscleGroup>> AddMuscleGroup(MuscleGroup newEx)
        {
            Console.WriteLine($"Received a post request for new MuscleGroup");

            if (newEx == null) return BadRequest();

            context.MuscleGroups.Add(newEx);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(AddMuscleGroup), new {id = newEx.Id}, newEx);
        }
    }
}