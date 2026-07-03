import { useState } from "react";
import type { Exercise } from "../../Components/Interfaces";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Dropdown, Row } from "react-bootstrap";
import type {
  CreateWorkoutExercisePayload,
  CreateWorkoutPayload,
  CreateWorkoutSetPayload,
} from "../../Components/CreatePayloads";

// Payloads
interface ExerciseCreateDisplay {
  name: string;
  data: CreateWorkoutExercisePayload;
}

const CreateWorkout = () => {
  const [startTime, setStartTime] = useState(new Date());
  const [notes, setNotes] = useState("");

  // Fetch all exercises for dropdown
  const fetchAllExercises = async (): Promise<Exercise[]> => {
    const response = await fetch("http://localhost:5240/api/exercises");
    if (!response.ok) throw new Error("Network error");
    return response.json();
  };

  const handleChangeName = (e: any) => {
    setWorkoutName(e.target.value);
  };

  const handleChangeNotes = (e: any) => {
    setNotes(e.target.value);
  };

  const [workoutName, setWorkoutName] = useState("");
  const [workoutExercises, setWorkoutExercises] =
    useState<ExerciseCreateDisplay[]>();

  const exResult = useQuery({
    queryKey: ["fetchExercises"],
    queryFn: fetchAllExercises,
    retry: false,
  });

  if (exResult.isLoading) return <p> Fetching exercises... </p>;
  if (exResult.error) return <p>Error: {exResult.error.message}</p>;
  if (!exResult.data) return <p> No exercises found in DB. </p>;

  const addExercise = (ex: Exercise): void => {
    const newWorkoutEx: ExerciseCreateDisplay = {
      name: ex.exerciseName,
      data: {
        order: workoutExercises ? workoutExercises.length : 0,
        exerciseId: ex.id,
        workoutSets: [],
      },
    };
    setWorkoutExercises((prev) => {
      if (!prev) {
        return [newWorkoutEx];
      }
      return [...prev, newWorkoutEx];
    });
  };

  const pushButton = () => {
    const exReady = (ex: ExerciseCreateDisplay): boolean => {
      if (!ex.data.workoutSets) return false;
      if (
        ex.data.workoutSets.filter((s) => s.reps == -1 || s.weight == -1)
          .length > 0
      )
        return false;
      return true;
    };

    if (!workoutExercises) return false;
    const workoutReady =
      workoutExercises.filter((ex) => !exReady(ex)).length == 0;

    return (
      <Button
        disabled={!workoutReady}
        variant="success mt-4 ms-2"
        onClick={() => pushPayload(workoutExercises)}
      >
        Create Workout
      </Button>
    );
  };

  const pushPayload = async (exercises: ExerciseCreateDisplay[]) => {
    const payload = {
      userID: 1,
      name: workoutName,
      notes: notes,
      start: startTime,
      end: new Date(),
      workoutExercises: exercises.map((e) => e.data),
    };

    console.log("Creating resource:", JSON.stringify(payload));

    try {
      const response = await fetch("http://localhost:5240/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Network error");
      const result = await response.json();
      console.log("Successfully created:", result);

      resetAllFields();
      return result;
    } catch (err) {
      console.error("Failed to create exercise", err);
    }
  };

  const addExerciseButton = (
    <Dropdown className="mt-4">
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        Add Exercise
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {exResult.data.map((ex, index) => (
          <Dropdown.Item key={index} onClick={() => addExercise(ex)}>
            {" "}
            {ex.exerciseName}{" "}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

  const updateSetReps = (
    exIndex: number,
    setIndex: number,
    newReps: number,
  ): void => {
    if (!workoutExercises) return;
    const newExercises = [...workoutExercises];

    if (!newExercises[exIndex]) return;
    const oldEx = newExercises[exIndex];
    const newEx: ExerciseCreateDisplay = {
      ...oldEx,
      data: { ...oldEx.data, workoutSets: [...oldEx.data.workoutSets] },
    };
    newEx.data.workoutSets[setIndex].reps = newReps;

    newExercises[exIndex] = newEx;
    setWorkoutExercises(newExercises);
  };

  const updateSetWeight = (
    exIndex: number,
    setIndex: number,
    newWeight: number,
  ): void => {
    if (!workoutExercises) return;
    const newExercises = [...workoutExercises];

    if (!newExercises[exIndex]) return;
    const oldEx = newExercises[exIndex];
    const newEx: ExerciseCreateDisplay = {
      ...oldEx,
      data: { ...oldEx.data, workoutSets: [...oldEx.data.workoutSets] },
    };
    newEx.data.workoutSets[setIndex].weight = newWeight;

    newExercises[exIndex] = newEx;
    setWorkoutExercises(newExercises);
  };

  const setDisplay = (
    exIndex: number,
    set: CreateWorkoutSetPayload,
    setIndex: number,
  ) => (
    <Card key={setIndex} className="mt-2">
      <Card.Body style={{ background: "#eeeeee" }}>
        <Card.Title> Set {setIndex + 1} </Card.Title>
        <Row>
          <Col>
            <Dropdown className="mt-4">
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {set.reps == -1
                  ? "Reps"
                  : set.reps == 1
                    ? set.reps + " rep"
                    : set.reps + " reps"}
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="overflow-scroll"
                style={{ maxHeight: "100px", maxWidth: "50px" }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                  (num, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => updateSetReps(exIndex, setIndex, num)}
                    >
                      {num}
                    </Dropdown.Item>
                  ),
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col>
            <Dropdown className="mt-4">
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {set.weight == -1 ? "Weight" : set.weight + " KG"}
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="overflow-scroll"
                style={{ maxHeight: "100px", maxWidth: "50px" }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                  (num, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => updateSetWeight(exIndex, setIndex, num)}
                    >
                      {num}
                    </Dropdown.Item>
                  ),
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const exDisplay = (ex: ExerciseCreateDisplay, exIndex: number) => (
    <Card key={exIndex} className="mt-4">
      <Card.Body>
        <Card.Title> {ex.name} </Card.Title>
        <Card.Text> Order: {ex.data.order} </Card.Text>
        {ex.data.workoutSets.length > 0 ? (
          ex.data.workoutSets.map((set, index) =>
            setDisplay(exIndex, set, index),
          )
        ) : (
          <Card.Text> No sets added to this exercise </Card.Text>
        )}

        <Button className="mt-4" onClick={() => addSet(exIndex)}>
          {" "}
          Add Set{" "}
        </Button>
      </Card.Body>
    </Card>
  );

  const addSet = (exIndex: number): void => {
    setWorkoutExercises((prev) => {
      if (!prev) return undefined;

      const oldEx = prev[exIndex];
      if (!oldEx) return prev;

      const newSet: CreateWorkoutSetPayload = {
        order: oldEx.data.workoutSets.length,
        weight: -1,
        reps: -1,
        type: -1,
      };

      const newExercises = [...prev];
      newExercises[exIndex] = {
        ...oldEx,
        data: {
          ...oldEx.data,
          workoutSets: [...oldEx.data.workoutSets, newSet],
        },
      };

      return newExercises;
    });
  };

  const resetAllFields = () => {
    setWorkoutName("");
    setWorkoutExercises([]);
    setStartTime(new Date());
  };

  return (
    <div className="container mt-4">
      <h1> Save Workout </h1>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <form>
              <div className="form-group">
                <label htmlFor="workoutName"> Workout Name </label>
                <input
                  type="text"
                  className="form-control"
                  value={workoutName}
                  onChange={handleChangeName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="notes"> Notes (optional) </label>
                <input
                  type="text"
                  className="form-control"
                  value={notes}
                  onChange={handleChangeNotes}
                />
              </div>

              <div className="container">
                {workoutExercises?.map((ex, index) => exDisplay(ex, index))}
              </div>

              <div className="d-flex">
                {addExerciseButton}
                {pushButton()}
              </div>
            </form>
          </div>

          {/* Display (right column) */}
          <div className="col-6">
            <h2> {workoutName == "" ? "Untitled Workout" : workoutName}</h2>
            <p>
              {" "}
              {/* {payload
                ? JSON.stringify(payload)
                : "None"}{" "} */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkout;
