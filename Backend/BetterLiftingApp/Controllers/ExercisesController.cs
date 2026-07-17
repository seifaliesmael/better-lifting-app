using System.Text.Json;
using AutoMapper;
using BetterLiftingApp.Data;
using BetterLiftingApp.DTOs.Request;
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
        private readonly IMapper mapper;
        public ExercisesController (LiftingContext _context, IMapper _mapper)
        {
            context = _context;
            mapper = _mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<Exercise>>> GetAllExercises()
        {
            Console.WriteLine("Received a get all request at Exercises");
            List<Exercise> exercises = await context.Exercises.Include(e => e.MuscleGroups).ToListAsync();
            Console.WriteLine("Sending data: " + JsonSerializer.Serialize(exercises));
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
        public async Task<ActionResult<Exercise>> AddExercise(ExRequest newEx)
        {
            Console.WriteLine($"Received a post request for new exercise");
            Console.WriteLine(JsonSerializer.Serialize(newEx));
            Console.WriteLine("Muscle groups:" + newEx.MuscleGroupIDs.ToArray().ToString());

            if (newEx == null) return BadRequest();

            // Convert request payload to DB Exercise (will not map musclegroups automatically)            
            Exercise ex = mapper.Map<Exercise>(newEx);
            // Add in the muscle groups
            ex.MuscleGroups =  await context.MuscleGroups.Where(e => newEx.MuscleGroupIDs.Contains(e.Id)).ToListAsync();

            context.Exercises.Add(ex);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExercise), new {id = ex.Id}, ex);
        }
    }
}