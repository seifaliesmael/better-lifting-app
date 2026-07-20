import { useQuery } from "@tanstack/react-query";
import type { ExRequest, WORequest } from "../Data/Requests";
import type { ExResponse, MuscleResponse, WOResponse } from "../Data/Responses";
import { getLoginToken } from "./authServices";

const rootURL = "http://localhost:5240/api";

/*
-----------------------------------------------------------------------
Fetch Methods
-----------------------------------------------------------------------
*/

export const fetchAllExercises = () => useQuery({
    queryKey: ["fetchExercises"],
    queryFn: async (): Promise<ExResponse[]> => {
      const response = await fetch(`${rootURL}/exercises`);
      if (!response.ok) throw new Error("Network error");
      return response.json();
    },
    retry: false,
    refetchOnWindowFocus: false,
});

export const fetchAllMuscleGroups = () => useQuery({
    queryKey: ["fetchMuscleGroups"],
    queryFn: async (): Promise<MuscleResponse[]> => {
      const response = await fetch(`${rootURL}/musclegroups`);
      if (!response.ok) throw new Error("Network error");
      return response.json();
    },
    retry: false,
  });

export const useFetchWorkouts = (email:string | undefined) => useQuery({
    queryKey: ["useFetchWorkouts", email],
    queryFn: async (): Promise<WOResponse[]> => {
      const loginToken = await getLoginToken();
      if (!loginToken) throw new Error("Not logged in");

      const response = await fetch(`${rootURL}/workouts/user`,
        {
          headers: {"Authorization": `Bearer ${loginToken}`}
        }
      );
      if (!response.ok) throw new Error("Network error");
      return response.json();
    },
    retry: false,
    enabled: (email != undefined)
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
  const response = await fetch(`${rootURL}/workouts`, {
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
  const response = await fetch("http://localhost:5240/api/exercises", {
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
