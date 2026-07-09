// For receiving data from the backend

// Exercise Response
export interface ExResponse {
  id:number;
  exerciseName: string;
  muscleGroups: MuscleResponse[];
  equipmentType: number;
}

// Muscle Group Response
export interface MuscleResponse { 
  id:number;
  name: string;
}

// Workout response types
export interface WOResponse {
  id:number;
  userID:number;
  name:string;
  notes?:string;
  start:Date;
  end:Date;
  workoutExercises:WOExResponse[];
}

export interface WOExResponse {
  id:number;
  order:number;
  exerciseId:number;
  name?:string;
  workoutSets:WOSetResponse[];
}

export interface WOSetResponse {
  id:number;
  order:number;
  weight:number;
  reps:number;
  type:number;
  rir?:number;
}