interface CreateWorkoutPayload {
  userID:number;
  name:string;
  notes?:string;
  start:Date;
  end:Date;
  workoutExercises:CreateWorkoutExercisePayload[];
}

interface CreateWorkoutExercisePayload {
  order:number;
  exerciseId:number;
  workoutSets:CreateWorkoutSetPayload[];
}

interface CreateWorkoutSetPayload {
  order:number;
  weight:number;
  reps:number;
  type:number;
  rpe?:number;
}

export type {CreateWorkoutPayload, CreateWorkoutExercisePayload, CreateWorkoutSetPayload}