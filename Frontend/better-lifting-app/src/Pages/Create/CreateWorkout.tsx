import { useContext, useState } from "react";
import type { Exercise } from "../../Components/Interfaces";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Form,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import type {
  CreateWorkoutExercisePayload,
  CreateWorkoutSetPayload,
} from "../../Components/CreatePayloads";
import { ThemeContext } from "../../contexts/theme/ThemeContext";
import { ExerciseDisplay } from "../../Components/WorkoutTracking/ExerciseDisplay";
import { fetchAllExercises } from "../../api/workoutServices";
import { AddExerciseButton, SaveWorkoutButton } from "../../Components/WorkoutTracking/WorkoutButtons";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

// adding a temporary unique ID so that it can be made Sortable (for drag and drop)
export interface LocalWorkoutExercise extends Omit<CreateWorkoutExercisePayload, 'workoutSets'> {
  id: string; 
  workoutSets:LocalWorkoutSet[]; // temporarily store localworkoutsets instead of payload sets, so we can add ID to them

}
export interface LocalWorkoutSet extends CreateWorkoutSetPayload {
  id:string;
}

const CreateWorkout = () => {
  const { theme } = useContext(ThemeContext);

  // States for tracking workout
  const [startTime, setStartTime] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState<LocalWorkoutExercise[]>([]);

  // Fetching all exercises from DB
  const exResult = useQuery({
    queryKey: ["fetchExercises"],
    queryFn: fetchAllExercises,
    retry: false,
  });

  if (exResult.isLoading) return <p> Fetching exercises... </p>;
  if (exResult.error) return <p>Error: {exResult.error.message}</p>;
  if (!exResult.data) return <p> No exercises found in DB. </p>;

  const addExercise = (ex: Exercise): void => {
    const newWorkoutEx: LocalWorkoutExercise = {
      name: ex.exerciseName,
      order: workoutExercises ? workoutExercises.length : 0,
      exerciseId: ex.id,
      workoutSets: [],
      id:crypto.randomUUID()
    };
    setWorkoutExercises((prev) => [...prev, newWorkoutEx]);
  };


  const resetFields = () => {
    setWorkoutName("");
    setWorkoutExercises([]);
    setStartTime(new Date());
  };

  const handleExDrag = (event:DragEndEvent) => {
      try {setWorkoutExercises((prev) => move(prev, event))}
      catch (err) {console.log("Error in exercise drag and drop:", err)}}

  return (
    <>
      <Container>
        <h1> {workoutName ? workoutName : "Untitled Workout"} </h1>
        <p> {JSON.stringify(workoutExercises)}</p>
        <p className="text-muted fw-semibold">
          {" "}
          {new Date(startTime).toDateString()}{" "}
        </p>
        <form>
          <Form.Label className="mb-0 pb-0" htmlFor="workoutName">
            {" "}
            Workout Name{" "}
          </Form.Label>
          <InputGroup>
            <FormControl
              type="text"
              id="workoutName"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
          </InputGroup>
          <p className={!workoutName ? "" : "fst-italic text-muted"}>
            {" "}
            Untitled workouts will be saved as the current date.{" "}
          </p>
          <div className="form-group">
            <label htmlFor="notes"> Notes (optional) </label>
            <input
              type="text"
              className="form-control"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>


          {/* Drag and drop exercises within a workout */}
          <DragDropProvider onDragEnd={handleExDrag}>
            <ul className="list">
              {workoutExercises?.map((ex, index) => (
                <ExerciseDisplay
                  key={ex.id}
                  workoutExercises={workoutExercises}
                  setWorkoutExercises={setWorkoutExercises}
                  ex={ex}
                  exIndex={index}
                  theme={theme}
                />
              ))}
            </ul>

          </DragDropProvider>

          <div className="d-flex">
            <AddExerciseButton data={exResult.data} addExercise={addExercise}/>
            <SaveWorkoutButton wkExercises={workoutExercises} workoutName={workoutName} notes={notes}
            startTime={startTime} resetFields={resetFields}/>
          </div>
        </form>
      </Container>
    </>
  );
};

export default CreateWorkout;
