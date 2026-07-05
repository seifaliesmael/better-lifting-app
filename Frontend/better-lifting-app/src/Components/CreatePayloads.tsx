interface CreateWorkoutPayload {
  userID:number;
  name:string;
  notes?:string;
  start:Date;
  end:Date;
  workoutExercises:CreateWorkoutExercisePayload[];
}

interface CreateWorkoutExercisePayload {
  id?:string; // Will be removed before sending to DB
  order:number;
  exerciseId:number;
  name?:string; // Will be removed before sending to DB
  workoutSets:CreateWorkoutSetPayload[];
}

interface CreateWorkoutSetPayload {
  id?:string; // Will be removed before sending to DB
  order:number;
  weight:number;
  reps:number;
  type:number;
  rpe?:number;
}

export type {CreateWorkoutPayload, CreateWorkoutExercisePayload, CreateWorkoutSetPayload}