import type { LocalWorkoutExercise } from "../Data/LocalData";

// Check if an exercise is valid (i.e, at least 1 set, set info is filled for each set.)
export const exerciseReady = (ex: LocalWorkoutExercise): boolean => {  
  if (!ex) return false;
  if (!ex.workoutSets) return false;

  // No sets
  if (ex.workoutSets.length < 1) return false;

  // If any sets are missing rep or weight data
  if (ex.workoutSets.some((s) => s.reps == -1 || s.weight == -1)) return false;

  return true;
};
