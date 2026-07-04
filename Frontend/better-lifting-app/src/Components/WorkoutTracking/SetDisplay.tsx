import type {
  CreateWorkoutExercisePayload,
  CreateWorkoutSetPayload,
} from "../CreatePayloads";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { List, type RowComponentProps } from "react-window";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  workoutExercises: CreateWorkoutExercisePayload[];
  setWorkoutExercises: Dispatch<
    SetStateAction<CreateWorkoutExercisePayload[]>
  >;
  exIndex: number;
  set: CreateWorkoutSetPayload;
  setIndex: number;
  theme: string;
}

// Dropdown prop for react-window list
interface DropdownRowData {
  exIndex: number;
  setIndex: number;
  updateFn: (exIndex: number, setIndex: number, val: number) => void;
}

// Dropdown item for reps
const RepRow = ({
  index,
  exIndex,
  setIndex,
  updateFn,
  style,
}: RowComponentProps<DropdownRowData>) => {
  const num = index + 1;
  return (
    <Dropdown.Item
      className="text-center"
      style={{ ...style, fontSize: "18px" }}
      onClick={() => updateFn(exIndex, setIndex, num)}
    >
      {num + " reps"}
    </Dropdown.Item>
  );
};

// Dropdown item for weight
const WeightRow = ({
  index,
  exIndex,
  setIndex,
  updateFn,
  style,
}: RowComponentProps<DropdownRowData>) => {
  const num = index + 1;
  return (
    <Dropdown.Item
      className="text-center"
      style={{ ...style, fontSize: "18px" }}
      onClick={() => updateFn(exIndex, setIndex, num * 2)}
    >
      {num * 2 + " kg"}
      {/* TODO- change this to times increment. rn default increment of 2kg. */}
    </Dropdown.Item>
  );
};

// Set Display Component -> Editing/Creating a set in an exercise
const SetDisplay = ({
  workoutExercises,
  setWorkoutExercises,
  exIndex,
  set,
  setIndex,
  theme,
}: Props) => {
  const updateSetReps = (
    exIndex: number,
    setIndex: number,
    newReps: number,
  ): void => {
    if (!workoutExercises) return;
    const newExercises = [...workoutExercises];

    if (!newExercises[exIndex]) return;
    const oldEx = newExercises[exIndex];
    const newEx: CreateWorkoutExercisePayload = {
      ...oldEx,
      workoutSets: [...oldEx.workoutSets],
    };
    newEx.workoutSets[setIndex].reps = newReps;

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
    const newEx: CreateWorkoutExercisePayload = {
      ...oldEx,
      workoutSets: [...oldEx.workoutSets],
    };
    newEx.workoutSets[setIndex].weight = newWeight;

    newExercises[exIndex] = newEx;
    setWorkoutExercises(newExercises);
  };

  // Fn for deleting a set
  const deleteSet = (exIndex: number, setIndex: number): void => {
    if (!workoutExercises) return;
    const newExercises = [...workoutExercises];
    if (!newExercises[exIndex]) return;

    const newEx: CreateWorkoutExercisePayload = {
      ...newExercises[exIndex],
      workoutSets: newExercises[exIndex].workoutSets.filter(
        (_, index) => index != setIndex,
      ),
    };

    newExercises[exIndex] = newEx;
    setWorkoutExercises(newExercises);
  };

  return (
    <Card
      key={setIndex}
      className={`mt-2 ${
        theme === "light"
          ? "bg-body-secondary text-dark"
          : "bg-dark-subtle text-white"
      }`}
    >
      <Card.Body>
        <Card.Title> Set {setIndex + 1} </Card.Title>
        <div className="d-flex align-items-center gap-3">
          <Col>
            <Row>
              {/* Reps Selection*/}
              <InputGroup className="w-auto">
                <Dropdown className="mt-4">
                  <Dropdown.Toggle
                    style={{ maxWidth: 100, minWidth: 100 }}
                    variant="secondary"
                    id="dropdown-basic"
                  >
                    {set.reps == -1
                      ? "Reps"
                      : set.reps == 1
                        ? set.reps + " rep"
                        : set.reps + " reps"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{
                      maxHeight: "150px",
                      minWidth: "100px",
                      maxWidth: "100px",
                      padding: 0,
                    }}
                  >
                    <List
                      style={{ height: 150, width: "100%" }}
                      rowComponent={RepRow}
                      rowCount={1000}
                      rowHeight={35}
                      rowProps={{ exIndex, setIndex, updateFn: updateSetReps }}
                    />
                  </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                  placeholder=""
                  type="number"
                  aria-label="Reps"
                  style={{ minWidth: 75, maxWidth: 5 }}
                  value={set.reps == -1 ? "" : set.reps}
                  onChange={(e) =>
                    updateSetReps(exIndex, setIndex, Number(e.target.value))
                  }
                />
              </InputGroup>

              {/* Weight Selection*/}
              <InputGroup className="w-auto">
                <Dropdown className="mt-4">
                  <Dropdown.Toggle
                    style={{ maxWidth: 100, minWidth: 100 }}
                    variant="secondary"
                    id="dropdown-basic"
                  >
                    {set.weight == -1 ? "Weight" : set.weight + " kg"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{
                      maxHeight: "150px",
                      minWidth: "100px",
                      maxWidth: "100px",
                      padding: 0,
                    }}
                  >
                    <List
                      style={{ height: 150, width: "100%" }}
                      rowComponent={WeightRow}
                      rowCount={1000}
                      rowHeight={35}
                      rowProps={{
                        exIndex,
                        setIndex,
                        updateFn: updateSetWeight,
                      }}
                    />
                  </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                  placeholder=""
                  type="number"
                  aria-label="Weight"
                  style={{ minWidth: 75, maxWidth: 75 }}
                  value={set.weight == -1 ? "" : set.weight}
                  onChange={(e) =>
                    updateSetWeight(exIndex, setIndex, Number(e.target.value))
                  }
                />
              </InputGroup>
            </Row>
          </Col>

          {/* Delete Button */}
          <Col className="text-end ">
            <Button
              className="me-4"
              variant="danger"
              onClick={() => deleteSet(exIndex, setIndex)}
            >
              <Trash />
            </Button>
          </Col>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SetDisplay;
