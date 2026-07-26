import { useContext, useState } from "react";
import { Card } from "../../Components/UI/Card";
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
  updateView: (page: string) => void;
}

const CreateWorkout = ({ updateView }: Props) => {
  const { theme } = useContext(ThemeContext);

  // States for tracking workout
  const [startTime, _] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState<LocalWorkoutExercise[]>([]);

  // Fetching all exercises from DB
  const exResult = fetchAllExercises();

  const isLight = theme === "light";
  const textColor = isLight ? "text-black" : "text-white";
  const inputBg = isLight ? "bg-gray-50" : "bg-gray-800";
  const borderColor = isLight ? "border-gray-300" : "border-gray-600";

  if (exResult.isLoading)
    return (
      <div className="flex-1 justify-center items-center m-4">
        <p className="text-center text-red-600 font-semibold">
          Fetching exercise options...
        </p>
      </div>
    );
  if (exResult.error)
    return (
      <div className="flex-1 justify-center items-center m-4">
        <p className="text-center text-red-600 font-semibold">
          Error: {exResult.error.message}
        </p>
      </div>
    );
  if (!exResult.data)
    return (
      <div className="flex-1 justify-center items-center m-4">
        <p className="text-center text-red-600 font-semibold">
          No exercise options found in the database. Would you like to create a
          custom exercise?
        </p>
      </div>
    );

  const addExercise = (ex: ExResponse): void => {
    const newWorkoutEx: LocalWorkoutExercise = {
      exerciseName: ex.exerciseName,
      order: workoutExercises ? workoutExercises.length : 0,
      exerciseId: ex.id,
      workoutSets: [],
      id: crypto.randomUUID()
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
  const handleExDrag = (event: DragEndEvent) => {
    try { setWorkoutExercises((prev) => move(prev, event)) }
    catch (err) { console.log("Error in exercise drag and drop:", err) }
  }

  return (
    <div className="flex-1 justify-center m-4">
      <Card className="gap-3">
        <Card.Body>
          <Card.Title className="text-center">
            {workoutName ? workoutName : "Untitled Workout"}
          </Card.Title>
          <WorkoutTimer startTime={startTime} />
          <p className="text-center text-gray-500 dark:text-gray-400 font-semibold">
            {" "}
            {new Date(startTime).toDateString()}{" "}
          </p>

          <form>
            {/* Workout name input */}
            <div className="mb-4 w-full">
              <label
                htmlFor="workoutName"
                className="text-xs font-bold mb-2 block text-black dark:text-white"
              >
                Name this workout
              </label>
              <input
                type="text"
                id="workoutName"
                placeholder="Untitled workout"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className={`w-full border rounded-lg px-4 py-3 ${inputBg} ${borderColor} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <p className={!workoutName ? "text-xs text-gray-500 dark:text-gray-400 mt-1" : "text-xs italic text-gray-500 dark:text-gray-400 mt-1"}>
                {" "}
                Untitled workouts will be saved as the current date.{" "}
              </p>
            </div>

            {/* Workout notes input */}
            <div className="mb-4 w-full">
              <label
                htmlFor="notes"
                className="text-xs font-bold mb-2 block text-gray-500 dark:text-gray-400"
              >
                Add notes to this workout (optional)
              </label>
              <input
                type="text"
                id="notes"
                placeholder="None"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full border rounded-lg px-4 py-3 ${inputBg} ${borderColor} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Drag and drop exercises within a workout */}
            <DragDropProvider onDragEnd={handleExDrag}>
              <ul className="list-none p-0 m-0">
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

            <div className="flex">
              <AddExerciseButton data={exResult.data} addExercise={addExercise} />
              <SaveWorkoutButton wkExercises={workoutExercises} workoutName={workoutName} notes={notes}
                startTime={startTime} resetFields={resetFields} />
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateWorkout;