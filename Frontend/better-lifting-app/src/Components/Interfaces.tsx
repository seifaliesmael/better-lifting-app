interface DisplayObject {
    id:number
}

interface Exercise extends DisplayObject{
  exerciseName: string;
  muscleGroups: MuscleGroup[];
  equipmentType: number;
}
interface MuscleGroup extends DisplayObject{
  name: string;
}

interface Workout extends DisplayObject {
  userID:number;
  name:string;
  notes?:string;
  start:Date;
  end:Date;
  workoutExercises:WorkoutExercise[];
}

interface WorkoutExercise extends DisplayObject {
  order:number;
  exerciseId:number;
  name?:string;
  workoutSets:WorkoutSet[];
}

interface WorkoutSet extends DisplayObject {
  order:number;
  weight:number;
  reps:number;
  type:number;
  rpe?:number;
}
export const equipmentTypes:string[] = ["Barbell", "Straight Bar", "Dumbbell", "Machine"]
export const setTypes:string[] = ["Warmup", "RegularSet", "DropSet"]


export type {DisplayObject, MuscleGroup, Exercise, WorkoutSet, WorkoutExercise, Workout}