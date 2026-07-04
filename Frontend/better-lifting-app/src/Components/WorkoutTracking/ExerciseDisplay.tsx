import { type Dispatch, type SetStateAction } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import SetDisplay from "./SetDisplay";
import type {
  CreateWorkoutExercisePayload,
  CreateWorkoutSetPayload,
} from "../CreatePayloads";
import { Trash } from "react-bootstrap-icons";

interface Props {
  workoutExercises: CreateWorkoutExercisePayload[];
  setWorkoutExercises: Dispatch<
    SetStateAction<CreateWorkoutExercisePayload[]>
  >;
  ex: CreateWorkoutExercisePayload;
  exIndex: number;
  theme: string;
}

export const ExerciseDisplay = ({
  workoutExercises,
  setWorkoutExercises,
  ex,
  exIndex,
  theme,
}: Props) => {
  // Helpers
  const deleteEx = (exIndex: number): void => {
    if (!workoutExercises) return;
    if (!workoutExercises[exIndex]) return;

    const newExercises = workoutExercises.filter(
      (_, index) => index != exIndex,
    );
    setWorkoutExercises(newExercises);
  };

  const addSet = (exIndex: number): void => {
    setWorkoutExercises((prev) => {
      const oldEx = prev[exIndex];
      if (!oldEx) return prev;

      const newSet: CreateWorkoutSetPayload = {
        order: oldEx.workoutSets.length,
        weight: -1,
        reps: -1,
        type: -1,
      };

      const newExercises = [...prev];
      newExercises[exIndex] = {
        ...oldEx,
        workoutSets: [...oldEx.workoutSets, newSet],
      };

      return newExercises;
    });
  };

  return (
    <Card
      key={exIndex}
      className={`mt-4 rounded-3 ${
        theme === "light"
          ? "bg-body-tertiary text-dark"
          : "bg-dark-subtle text-white"
      }`}
    >
      <Card.Body>
        <Card.Title> {ex.name} </Card.Title>
        <Card.Text> Order: {ex.order} </Card.Text>
        {ex.workoutSets.length > 0 ? (
          ex.workoutSets.map((set, index) => (
            <SetDisplay
              exIndex={exIndex}
              set={set}
              setIndex={index}
              theme={theme}
              workoutExercises={workoutExercises}
              setWorkoutExercises={setWorkoutExercises}
            />
          ))
        ) : (
          <Card.Text> No sets added to this exercise </Card.Text>
        )}

        <Row>
          <Col>
            <Button className="mt-4" onClick={() => addSet(exIndex)}>
              Add Set
            </Button>
          </Col>
          <Col className="text-end">
            <Button
              className="me-4 mt-4"
              variant="danger"
              onClick={() => deleteEx(exIndex)}
            >
              {" "}
              Delete Exercise
              <Trash className="ms-1" />
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ExerciseDisplay;
