import { useContext, useState } from "react";
import {
  Container,
  Form,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import type {
  ExResponse
} from "../../Data/Responses";
import { ThemeContext } from "../../contexts/theme/ThemeContext";
import { ExerciseDisplay } from "../../Components/WorkoutTracking/ExerciseDisplay";
import { fetchAllExercises } from "../../api/dataServices";
import { AddExerciseButton, SaveWorkoutButton } from "../../Components/WorkoutTracking/WorkoutButtons";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import type { LocalWorkoutExercise } from "../../Data/LocalData";
import WorkoutTimer from "../../Components/Display/WorkoutTimer";

interface Props {
  updateView: (page:string) => void;
}

const CreateWorkout = ({updateView} : Props) => {
  const { theme } = useContext(ThemeContext);
  
  // States for tracking workout
  const [startTime, _] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState<LocalWorkoutExercise[]>([]);

  // Fetching all exercises from DB
  const exResult = fetchAllExercises();

  if (exResult.isLoading) return <p> Fetching exercises... </p>;
  if (exResult.error) return <p>Error: {exResult.error.message}</p>;
  if (!exResult.data) return <p> No exercises found in DB. </p>;

  const addExercise = (ex: ExResponse): void => {
    const newWorkoutEx: LocalWorkoutExercise = {
      exerciseName: ex.exerciseName,
      order: workoutExercises ? workoutExercises.length : 0,
      exerciseId: ex.id,
      workoutSets: [],
      id:crypto.randomUUID()
    };
    setWorkoutExercises((prev) => [...prev, newWorkoutEx]);
  };

  const resetFields = () => {
    // setWorkoutName("");
    // setNotes("");
    // setWorkoutExercises([]);
    // setStartTime(new Date());
    updateView("default");
  };

  // Drag and drop exercises
  const handleExDrag = (event:DragEndEvent) => {
      try {setWorkoutExercises((prev) => move(prev, event))}
      catch (err) {console.log("Error in exercise drag and drop:", err)}}

  return (
    <>
      <Container>
        <div className="d-flex align-items-center gap-3">
          <h1> {workoutName ? workoutName : "Untitled Workout"} </h1>
          <WorkoutTimer startTime={startTime} theme={theme} />
        </div>
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
            <ul className="list-unstyled">
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
