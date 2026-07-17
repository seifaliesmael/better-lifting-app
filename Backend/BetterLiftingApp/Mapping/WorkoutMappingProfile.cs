using AutoMapper;
using BetterLiftingApp.DTOs.Request;
using BetterLiftingApp.DTOs.Response;
using BetterLiftingApp.Models;
namespace BetterLiftingApp.Mapping
{
    public class WorkoutMappingProfile : Profile
    {
        public WorkoutMappingProfile() // Mapping for class to Request/Responses (DTOs)
        {

            // Workouts --------------------------------
            // DB Data -> Response payloads
            // Backend -> Frontend
            CreateMap<WorkoutSet, WOSetResponse>();
            CreateMap<WorkoutExercise, WOExResponse>();
            CreateMap<Workout, WOResponse>();

            // Request payloads -> DB Data
            // Frontend -> Backend
            CreateMap<WOSetRequest, WorkoutSet>();
            CreateMap<WOExRequest, WorkoutExercise>();
            CreateMap<WORequest, Workout>();

            // Exercises ------------------------------
            CreateMap<ExRequest, Exercise>();
        }
    }
}