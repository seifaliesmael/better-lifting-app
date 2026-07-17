// For sending data to the backend

export interface ExRequest {
  exerciseName: string,
  muscleGroupIDs: number[]
  equipmentType: number
}


export interface WORequest {
  name:string;
  notes?:string;
  start:Date;
  end:Date;
  workoutExercises:WOExRequest[];
}

export interface WOExRequest {
  id?:string; // Will be removed before sending to DB
  order:number;
  exerciseId:number;
  exerciseName?:string; // Will be removed before sending to DB
  workoutSets:WOSetRequest[];
}

export interface WOSetRequest {
  id?:string; // Will be removed before sending to DB
  order:number;
  weight:number;
  reps:number;
  type:number;
  rir?:number;
}
