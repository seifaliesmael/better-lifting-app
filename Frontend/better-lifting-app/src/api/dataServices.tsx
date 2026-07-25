import { useQuery } from "@tanstack/react-query";
import type { ExRequest, WORequest } from "../Data/Requests";
import type { ExResponse, MuscleResponse, WOResponse } from "../Data/Responses";

const rootURL = import.meta.env.VITE_API_BASE_URL;
/*
-----------------------------------------------------------------------
Fetch Methods
-----------------------------------------------------------------------
*/

export const fetchAllExercises = () => useQuery({
    queryKey: ["fetchExercises"],
    queryFn: async (): Promise<ExResponse[]> => {
      const response = await fetch(`${rootURL}/Exercises`);
      if (!response.ok) throw new Error("Network error");
      return response.json();
    },
    retry: false,
  });

export const fetchAllMuscleGroups = () => useQuery({
    queryKey: ["fetchMuscleGroups"],
    queryFn: async (): Promise<MuscleResponse[]> => {
      const response = await fetch(`${rootURL}/MuscleGroups`);
      if (!response.ok) throw new Error("Network error");
      return response.json();
    },
    retry: false,
  });

export const fetchAllWorkouts = (email:string) => useQuery({
    queryKey: ["fetchAllWorkouts", email],
    queryFn: async (): Promise<WOResponse[]> => {
      const response = await fetch(`${rootURL}/Workouts/user`, {credentials:"include"});
      if (!response.ok) throw new Error("Network error");
      return response.json();
    },
    retry: false,
  });

/*
-----------------------------------------------------------------------
Post Methods
-----------------------------------------------------------------------
*/

// Push workout to DB
export const createWorkout = async (
  payload: WORequest,
): Promise<WOResponse> => {
  const response = await fetch(`${rootURL}/Workouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials:"include"
  });
  if (!response.ok)
    throw new Error(`Network error, HTTP code ${response.status}`);
  return response.json();
};

// Push new exercise to DB
export const createExercise = async (
  payload: ExRequest,
): Promise<ExResponse> => {
  const response = await fetch("http://localhost:5240/api/Exercises", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok)
    throw new Error(`Network error, HTTP code ${response.status}`);
  return response.json();
};
