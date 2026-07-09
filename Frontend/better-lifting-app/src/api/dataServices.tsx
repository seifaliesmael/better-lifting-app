import { useQuery } from "@tanstack/react-query";
import type { WORequest } from "../Data/Requests";
import type { ExResponse, MuscleResponse, WOResponse } from "../Data/Responses";

const rootURL = "http://localhost:5240/api";

/*
-----------------------------------------------------------------------
Fetch Methods
-----------------------------------------------------------------------
*/

export const fetchAllExercises = () => {
  const reqFn = async (): Promise<ExResponse[]> => {
    const response = await fetch(`${rootURL}/exercises`);
    if (!response.ok) throw new Error("Network error");
    return response.json();
  }

  return useQuery({
    queryKey: ["fetchExercises"],
    queryFn: reqFn,
    retry: false,
  });
};
  
export const fetchAllMuscleGroups = () => {
  const reqFn = async (): Promise<MuscleResponse[]> => {
    const response = await fetch(`${rootURL}/musclegroups`);
    if (!response.ok) throw new Error('Network error');
    return response.json();
  }

  return useQuery({
    queryKey: ['fetchMuscleGroups'],
    queryFn: reqFn,
    retry: false
  });
};

export const fetchAllWorkouts = (userid:number) => {
  const reqFn = async (): Promise<WOResponse[]> => {
    const response = await fetch(`${rootURL}/workouts/user/${userid}`);
    if (!response.ok) throw new Error("Network error");
    return response.json();
  }

  return useQuery({
    queryKey: ["fetchAllWorkouts", userid],
    queryFn: reqFn,
    retry: false,
  });
}

/*
-----------------------------------------------------------------------
Post Methods
-----------------------------------------------------------------------
*/

// Push workout to DB
export const createWorkout = async (payload: WORequest):Promise<WOResponse> => {
  const response = await fetch(`${rootURL}/workouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Network error");
  return response.json();
};

