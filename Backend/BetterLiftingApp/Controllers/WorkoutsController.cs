using System.Text.Json;
using BetterLiftingApp.Data;
using BetterLiftingApp.DTOs.Response;
using BetterLiftingApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        [HttpGet("user/{userid}")]
        public async Task<ActionResult<List<WorkoutResponse>>> GetAllWorkouts(int userid)
        {
            Console.WriteLine("Received a get all request at Workouts");
            List<WorkoutResponse> wks = await context.Workouts.Where(w => w.UserId == userid).Select(w => new WorkoutResponse
            {
                Id = w.Id,
                Name = w.Name,
                UserId = w.UserId,
                Notes = w.Notes,
                Start = w.Start,
                End = w.End,
                WorkoutExercises = w.WorkoutExercises.Select(ex => new WorkoutExerciseResponse
                {
                    Id = ex.Id,
                    Order = ex.Order,
                    ExerciseId = ex.ExerciseId,
                    Name = ex.Exercise.ExerciseName,
                    WorkoutSets = ex.WorkoutSets.Select(set => new WorkoutSetResponse
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
        public async Task<ActionResult<WorkoutResponse>> GetWorkout(int id)
        {
            Console.WriteLine($"Received a get request for id: {id}");
            WorkoutResponse? wk = await context.Workouts
            .Where(w => w.Id == id)
            .Select(w => new WorkoutResponse
            {
                Id = w.Id,
                Name = w.Name,
                UserId = w.UserId,
                Notes = w.Notes,
                Start = w.Start,
                End = w.End,
                WorkoutExercises = w.WorkoutExercises.Select(ex => new WorkoutExerciseResponse
                {
                    Id = ex.Id,
                    Order = ex.Order,
                    ExerciseId = ex.ExerciseId,
                    Name = ex.Exercise.ExerciseName,
                    WorkoutSets = ex.WorkoutSets.Select(set => new WorkoutSetResponse
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
        public async Task<ActionResult<WorkoutPayload>> AddWorkout(WorkoutPayload payload)
        {
            Console.WriteLine("Received a workout create request with body:");
            Console.WriteLine(JsonSerializer.Serialize(payload));

            Workout wk = new Workout
            {
                Name = payload.Name,
                UserId = payload.UserId,
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
            WorkoutResponse response = new WorkoutResponse
            {
                Id = wk.Id,
                Name = wk.Name,
                UserId = wk.UserId,
                Notes = wk.Notes,
                Start = wk.Start,
                End = wk.End,
                WorkoutExercises = wk.WorkoutExercises.Select(ex => new WorkoutExerciseResponse
                {
                    Id = ex.Id,
                    Order = ex.Order,
                    ExerciseId = ex.ExerciseId,
                    WorkoutSets = ex.WorkoutSets.Select(set => new WorkoutSetResponse
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

    public class WorkoutPayload
    {
        public int UserId {get; set;}
        public string Name {get; set;} = null!;
        public string? Notes {get; set;}
        public DateTime Start {get; set;}
        public DateTime End {get; set;}
        public List<WorkoutExercisePayload> WorkoutExercises {get; set;} = [];
    }

    public class WorkoutExercisePayload
    {
        public int Order {get; set;}
        public int ExerciseId {get; set;}
        public List<WorkoutSetPayload> WorkoutSets {get; set;} = [];
    }
    public class WorkoutSetPayload
    {
        public int Order {get; set;}
        public int Weight { get; set; }
        public int Reps {get; set;}
        public int Type {get; set;}
        public int? RIR {get; set;}
    }
}