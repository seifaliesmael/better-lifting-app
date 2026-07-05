import { Button, Dropdown } from "react-bootstrap";
import type { Exercise } from "../Interfaces";
import { exerciseReady } from "../../Utilities/workoutUtils";
import type { CreateWorkoutPayload } from "../CreatePayloads";
import { createWorkout } from "../../api/workoutServices";
import type { LocalWorkoutExercise } from "../../Pages/Create/CreateWorkout";

interface AddExerciseProps {
  data: Exercise[] | undefined;
  addExercise: (ex: Exercise) => void;
}

// Add a new exercise to a workout
export const AddExerciseButton = ({ data, addExercise }: AddExerciseProps) => (
  <Dropdown className="mt-4">
    <Dropdown.Toggle variant="primary" id="dropdown-basic">
      Add Exercise
    </Dropdown.Toggle>

    <Dropdown.Menu>
      {data?.map((ex, index) => (
        <Dropdown.Item key={index} onClick={() => addExercise(ex)}>
          {" "}
          {ex.exerciseName}{" "}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

interface SaveWorkoutProps {
  wkExercises: LocalWorkoutExercise[];
  workoutName: string;
  notes?: string;
  startTime: Date;
  resetFields: () => void;
}
// Save workout and push to DB
export const SaveWorkoutButton = ({
  wkExercises,
  workoutName,
  notes,
  startTime,
  resetFields,
}: SaveWorkoutProps) => {
  // Function to push workout to DB and reset fields
  const pushPayload = async (exercises: LocalWorkoutExercise[]) => {
    const payload: CreateWorkoutPayload = {
      userID: 1,
      name: workoutName
        ? workoutName
        : `Untitled Workout [${startTime.toDateString()}]`,
      notes: notes,
      start: startTime,
      end: new Date(),
      workoutExercises: exercises.map(
        ({ name, id, workoutSets, ...rest }, index) => ({
          ...rest,
          order: index,
          workoutSets: workoutSets.map((set, index) => ({
            ...set,
            order: index,
          })),
        }),
      ),
    };

    console.log("Creating resource:", JSON.stringify(payload));

    try {
      await createWorkout(payload);
      resetFields();
    } catch (err) {
      console.error("Failed to create exercise", err);
    }
  };

  if (!wkExercises) return;
  const workoutReady =
    wkExercises.length >= 1 && !wkExercises.some((ex) => !exerciseReady(ex));

  return (
    <Button
      disabled={!workoutReady}
      variant="success mt-4 ms-2"
      onClick={() => pushPayload(wkExercises)}
    >
      Create Workout
    </Button>
  );
};
