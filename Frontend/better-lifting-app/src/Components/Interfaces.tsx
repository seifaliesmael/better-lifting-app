interface DisplayObject {
    id:number
}

interface Exercise extends DisplayObject{
  exerciseName: string,
  muscleGroups: MuscleGroup[]
  equipmentType: number
}
interface MuscleGroup extends DisplayObject{
  name: string
}

export type {DisplayObject, MuscleGroup, Exercise}