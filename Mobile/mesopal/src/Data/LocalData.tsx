import type { WOExRequest, WOSetRequest } from "./Requests";

// adding a temporary unique ID so that it can be made Sortable (for drag and drop)
export interface LocalWorkoutExercise extends Omit<WOExRequest, 'workoutSets'> {
  id: string; 
  workoutSets:LocalWorkoutSet[]; // temporarily store localworkoutsets instead of payload sets, so we can add ID to them

}
export interface LocalWorkoutSet extends WOSetRequest {
  id:string;
}

export const equipmentTypes:string[] = ["Barbell", "Straight Bar", "Dumbbell", "Machine"]
export const setTypes:string[] = ["Warmup", "RegularSet", "DropSet"]

