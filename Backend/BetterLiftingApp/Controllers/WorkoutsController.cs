using System.Text.Json;
using BetterLiftingApp.Data;
using BetterLiftingApp.DTOs.Response;
using BetterLiftingApp.DTOs.Request;
using BetterLiftingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Security.Claims;

namespace BetterLiftingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkoutsController : ControllerBase
    {
        private readonly LiftingContext context;
        public WorkoutsController(LiftingContext _context)
        {
            context = _context;
        }

        // Get all workouts for a user
        [HttpGet("user")]
        [Authorize]
        public async Task<ActionResult<List<WOResponse>>> GetAllWorkouts()
        {
            Console.WriteLine("Received a get all request at Workouts");
            string? userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userid == null || userid == "") return Unauthorized("User ID not found.");

            Console.WriteLine("User ID received: " + userid);
            
            List<WOResponse> wks = await context.Workouts.Where(w => w.UserId == userid).Select(w => new WOResponse
            {
                Id = w.Id,
                Name = w.Name,
                Notes = w.Notes,
                Start = w.Start,
                End = w.End,
                WorkoutExercises = w.WorkoutExercises.Select(ex => new WOExResponse
                {
                    Id = ex.Id,
                    Order = ex.Order,
                    ExerciseId = ex.ExerciseId,
                    Name = ex.Exercise.ExerciseName,
                    WorkoutSets = ex.WorkoutSets.Select(set => new WOSetResponse
                    {
                        Id = set.Id,
                        Order = set.Order,
                        Weight = set.Weight,
                        Reps = set.Reps,
                        Type = (DTOs.Response.SetType) set.Type,
                        RIR = set.RIR
                    }).ToList()
                }).ToList()
            }).ToListAsync();
            return Ok(wks);
        }

        // Get a specific workout
        [HttpGet("{id}")]
        public async Task<ActionResult<WOResponse>> GetWorkout(int id)
        {
            Console.WriteLine($"Received a get request for id: {id}");
            WOResponse? wk = await context.Workouts
            .Where(w => w.Id == id)
            .Select(w => new WOResponse
            {
                Id = w.Id,
                Name = w.Name,
                Notes = w.Notes,
                Start = w.Start,
                End = w.End,
                WorkoutExercises = w.WorkoutExercises.Select(ex => new WOExResponse
                {
                    Id = ex.Id,
                    Order = ex.Order,
                    ExerciseId = ex.ExerciseId,
                    Name = ex.Exercise.ExerciseName,
                    WorkoutSets = ex.WorkoutSets.Select(set => new WOSetResponse
                    {
                        Id = set.Id,
                        Order = set.Order,
                        Weight = set.Weight,
                        Reps = set.Reps,
                        Type = (DTOs.Response.SetType) set.Type,
                        RIR = set.RIR
                    }).ToList()
                }).ToList()
            })
            .FirstOrDefaultAsync();


            if (wk == null) return NotFound();
            return Ok(wk); 
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<WORequest>> AddWorkout(WORequest payload)
        {
            Console.WriteLine("Received a workout create request with body:");
            Console.WriteLine(JsonSerializer.Serialize(payload));

            string? userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userid == null || userid == "") return Unauthorized("User ID not found.");

            Workout wk = new Workout
            {
                Name = payload.Name,
                UserId = userid,
                Notes = payload.Notes,
                Start = payload.Start,
                End = payload.End,
                WorkoutExercises = payload.WorkoutExercises.Select(ex => new WorkoutExercise
                {
                    Order = ex.Order,
                    ExerciseId = ex.ExerciseId,
                    WorkoutSets = ex.WorkoutSets.Select(set => new WorkoutSet
                    {
                        Order = set.Order,
                        Weight = set.Weight,
                        Reps = set.Reps,
                        Type = (Models.SetType) set.Type,
                        RIR = set.RIR
                    }).ToList()
                }).ToList()
            };

            context.Workouts.Add(wk);
            await context.SaveChangesAsync();

            // TODO : Make a function for this casting
            WOResponse response = new WOResponse
            {
                Id = wk.Id,
                Name = wk.Name,
                Notes = wk.Notes,
                Start = wk.Start,
                End = wk.End,
                WorkoutExercises = wk.WorkoutExercises.Select(ex => new WOExResponse
                {
                    Id = ex.Id,
                    Order = ex.Order,
                    ExerciseId = ex.ExerciseId,
                    WorkoutSets = ex.WorkoutSets.Select(set => new WOSetResponse
                    {
                        Id = set.Id,
                        Order = set.Order,
                        Weight = set.Weight,
                        Reps = set.Reps,
                        Type = (DTOs.Response.SetType)set.Type,
                        RIR = set.RIR
                    }).ToList()
                }).ToList()
            };

            return CreatedAtAction(nameof(GetWorkout), new {id = wk.Id}, response);
        }
    }
}