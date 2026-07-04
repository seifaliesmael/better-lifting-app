import type { CreateWorkoutPayload } from "../Components/CreatePayloads";
import type { Exercise } from "../Components/Interfaces";

const rootURL = "http://localhost:5240/api";

// Fetch all exercises for dropdown
export const fetchAllExercises = async (): Promise<Exercise[]> => {
  const response = await fetch(`${rootURL}/exercises`);
  if (!response.ok) throw new Error("Network error");
  return response.json();
};

// Push workout to DB
export const createWorkout = async (payload: CreateWorkoutPayload) => {
  const response = await fetch(`${rootURL}/workouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Network error");
  return response.json();
};
