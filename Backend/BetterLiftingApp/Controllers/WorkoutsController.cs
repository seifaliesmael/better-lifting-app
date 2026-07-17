using System.Text.Json;
using BetterLiftingApp.Data;
using BetterLiftingApp.DTOs.Response;
using BetterLiftingApp.DTOs.Request;
using BetterLiftingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Security.Claims;
using AutoMapper;
using System.Net.Mail;

namespace BetterLiftingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkoutsController : ControllerBase
    {
        private readonly LiftingContext context;
        private readonly IMapper mapper;
        public WorkoutsController(LiftingContext _context, IMapper _mapper)
        {
            context = _context;
            mapper = _mapper;
        }

        // Get all workouts for a user
        [HttpGet("user")]
        [Authorize]
        public async Task<ActionResult<List<WOResponse>>> GetAllWorkouts()
        {
            Console.WriteLine("Received a get all request at Workouts");
            
            // Get userid from HttpOnly cookie
            string? userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userid == null || userid == "") return Unauthorized("User ID not found.");

            Console.WriteLine("User ID received: " + userid);

            // Find user's DB workouts -> include statements otherwise lazy loading will only give a shallow copy (top level)
            List<Workout> wks = await context.Workouts.Where(w => w.UserId == userid)
            .Include(w => w.WorkoutExercises).ThenInclude(we => we.Exercise)
            .Include(w => w.WorkoutExercises).ThenInclude(we => we.WorkoutSets)
            .ToListAsync();

            // Convert workouts into response payloads
            List<WOResponse> response = mapper.Map<List<WOResponse>>(wks);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WOResponse>> GetWorkout(int id)
        {
            Console.WriteLine($"Received a get request for id: {id}");

            // Find workout with corresponding ID
            Workout? wk = await context.Workouts.Where(w => w.Id == id)
            .Include(w => w.WorkoutExercises).ThenInclude(we => we.Exercise)
            .Include(w => w.WorkoutExercises).ThenInclude(we => we.WorkoutSets)
            .FirstOrDefaultAsync();

            if (wk == null) return NotFound();

            // Convert DB workout to response payload
            WOResponse response = mapper.Map<WOResponse>(wk);
            return Ok(response); 
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<WORequest>> AddWorkout(WORequest payload)
        {
            // For Debugging
            Console.WriteLine("Received a workout create request with body:");
            Console.WriteLine(JsonSerializer.Serialize(payload));

            // Get userid from HttpOnly cookie
            string? userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userid == null || userid == "") return Unauthorized("User ID not found.");

            // Convert request payload into DB workout
            Workout wk = mapper.Map<Workout>(payload);
            wk.UserId = userid;

            // Save new workout in DB
            context.Workouts.Add(wk);
            await context.SaveChangesAsync();

            // Convert to response payload to send back to frontend
            WOResponse response = mapper.Map<WOResponse>(wk);
            return CreatedAtAction(nameof(GetWorkout), new {id = wk.Id}, response);
        }
    }
}