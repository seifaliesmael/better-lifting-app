import {
  Button,
  Card,
  Dropdown,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  ArrowDown,
  ArrowUp,
  GripHorizontal,
  Trash,
} from "react-bootstrap-icons";
import { List, type RowComponentProps } from "react-window";
import type { Dispatch, SetStateAction } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import type {
  LocalWorkoutExercise,
  LocalWorkoutSet,
} from "../../Data/LocalData";

interface Props {
  workoutExercises: LocalWorkoutExercise[];
  setWorkoutExercises: Dispatch<SetStateAction<LocalWorkoutExercise[]>>;
  exIndex: number;
  set: LocalWorkoutSet;
  setIndex: number;
  theme: string;
}

// Dropdown prop for react-window list
interface DropdownRowData {
  exIndex: number;
  setIndex: number;
  updateFn: (exIndex: number, setIndex: number, val: number) => void;
}

const setTypes = ["Warm-up Set", "Regular Set", "Drop Set"];

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

// Dropdown row for RIR
const RirRow = ({
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
      style={{ ...style, fontSize: "16px" }}
      onClick={() => updateFn(exIndex, setIndex, num)}
    >
      {num + " RIR"}
    </Dropdown.Item>
  );
};

// Dropdown row for setType
const SetTypeRow = ({
  index,
  exIndex,
  setIndex,
  updateFn,
  style,
}: RowComponentProps<DropdownRowData>) => {
  const num = index;
  return (
    <Dropdown.Item
      className="text-center"
      style={{ ...style, fontSize: "16px" }}
      onClick={() => updateFn(exIndex, setIndex, num)}
    >
      {setTypes[num]}
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
  const { ref, handleRef } = useSortable({ id: set.id, index: setIndex });

  // Fn for updating a set -> takes in an updateFn lambda function
  const updateSet = (
    exIndex: number,
    setIndex: number,
    updateFn: (prev: LocalWorkoutSet) => LocalWorkoutSet,
  ): void => {
    setWorkoutExercises((prev) => {
      const newExercises: LocalWorkoutExercise[] = [...workoutExercises];
      if (!newExercises[exIndex]) return prev;

      const oldEx: LocalWorkoutExercise = newExercises[exIndex];

      const newEx: LocalWorkoutExercise = {
        ...oldEx,
        workoutSets: [...oldEx.workoutSets],
      };

      newEx.workoutSets[setIndex] = updateFn(newEx.workoutSets[setIndex]);
      newExercises[exIndex] = newEx;

      return newExercises;
    });
  };

  // Fn for deleting a set
  const deleteSet = (exIndex: number, setIndex: number): void => {
    if (!workoutExercises) return;
    const newExercises = [...workoutExercises];
    if (!newExercises[exIndex]) return;

    const newEx: LocalWorkoutExercise = {
      ...newExercises[exIndex],
      workoutSets: newExercises[exIndex].workoutSets.filter(
        (_, index) => index != setIndex,
      ),
    };

    newExercises[exIndex] = newEx;
    setWorkoutExercises(newExercises);
  };

  // Move sets up/down by one
  const handleSetMove = (direction: "up" | "down", setIndex: number) => {
    // Edge cases
    if (direction === "up" && setIndex === 0) return;
    if (
      direction === "down" &&
      setIndex === workoutExercises[exIndex].workoutSets.length - 1
    )
      return;

    setWorkoutExercises((prev) => {
      const newExercises = [...prev];
      const newEx = { ...newExercises[exIndex] };
      const newSets = [...newEx.workoutSets];

      // Swap with previous element
      if (direction === "up") {
        [newSets[setIndex], newSets[setIndex - 1]] = [
          newSets[setIndex - 1],
          newSets[setIndex],
        ];
      }
      // Swap with next element
      else {
        [newSets[setIndex], newSets[setIndex + 1]] = [
          newSets[setIndex + 1],
          newSets[setIndex],
        ];
      }

      newEx.workoutSets = newSets;
      newExercises[exIndex] = newEx;
      return newExercises;
    });
  };

  return (
    <Card
      ref={ref}
      key={setIndex}
      style={{ touchAction: "none" }}
      className={`mt-2 ${
        theme === "light"
          ? "bg-body-secondary text-dark"
          : "bg-dark-subtle text-white"
      }`}
    >
      <Card.Body>
        <Card.Title className="d-flex justify-content-between mb-3">
          <span>Set {setIndex + 1}</span>
          <div className="d-flex">
            {/* Move up button */}
            <Button
              style={{
                background: "none",
                borderStyle: "none",
                color: theme == "light" ? "black" : "white",
              }}
              onClick={() => handleSetMove("up", setIndex)}
            >
              {" "}
              <ArrowUp />{" "}
            </Button>
            {/* Move down button */}
            <Button
              style={{
                background: "none",
                borderStyle: "none",
                color: theme == "light" ? "black" : "white",
              }}
              onClick={() => handleSetMove("down", setIndex)}
            >
              {" "}
              <ArrowDown />{" "}
            </Button>
            {/* Drag Handle */}
            <div
              ref={handleRef}
              style={{ cursor: "grab", touchAction: "none" }}
              className="p-2"
            >
              <GripHorizontal size={20} />
            </div>
          </div>
        </Card.Title>

        <div className="d-flex align-items-center justify-content-between gap-3">
          {/* Inputs */}
          <div className="d-flex flex-wrap align-items-center gap-3 w-100">
            {/* Reps Selection*/}
            <InputGroup className="w-auto">
              <Dropdown className="mt-4">
                <Dropdown.Toggle
                  style={{ maxWidth: 100, minWidth: 100 }}
                  variant="secondary"
                  id="dropdown-reps"
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
                    rowProps={{
                      exIndex,
                      setIndex,
                      updateFn: (exIndex, setIndex, val) => {
                        updateSet(exIndex, setIndex, (prev) => ({
                          ...prev,
                          reps: val,
                        }));
                      },
                    }}
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
                  updateSet(exIndex, setIndex, (s) => ({
                    ...s,
                    reps: Number(e.target.value),
                  }))
                }
              />
            </InputGroup>

            {/* Weight Selection*/}
            <InputGroup className="w-auto">
              <Dropdown className="mt-4">
                <Dropdown.Toggle
                  style={{ maxWidth: 100, minWidth: 100 }}
                  variant="secondary"
                  id="dropdown-weight"
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
                      updateFn: (exIndex, setIndex, val) => {
                        updateSet(exIndex, setIndex, (prev) => ({
                          ...prev,
                          weight: val,
                        }));
                      },
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
                  updateSet(exIndex, setIndex, (prev) => ({
                    ...prev,
                    weight: Number(e.target.value),
                  }))
                }
              />
            </InputGroup>

            {/* Set Type Selection */}
            <InputGroup className="w-auto">
              <Dropdown className="mt-4">
                <Dropdown.Toggle
                  style={{ maxWidth: 125, minWidth: 125 }}
                  variant="danger"
                  id="dropdown-basic"
                >
                  {" "}
                  {setTypes[set.type]}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  style={{
                    maxHeight: "150px",
                    minWidth: "125px",
                    maxWidth: "125px",
                    padding: 0,
                  }}
                >
                  <List
                    style={{ height: 115, width: "100%" }}
                    rowComponent={SetTypeRow}
                    rowCount={3}
                    rowHeight={35}
                    rowProps={{
                      exIndex,
                      setIndex,
                      updateFn: (
                        exIndex,
                        setIndex,
                        val,
                      ) => {
                        updateSet(
                          exIndex,
                          setIndex,
                          (prev) => ({ ...prev, type: val })
                        );
                      },
                    }}
                  />
                </Dropdown.Menu>
              </Dropdown>
            </InputGroup>

            {/* RIR Selection (Optional) */}
            <InputGroup className="w-auto">
              <Dropdown className="mt-4">
                <Dropdown.Toggle
                  style={{ maxWidth: 75, minWidth: 75 }}
                  variant="danger"
                  id="dropdown-basic"
                >
                  {" "}
                  {set.rir ? set.rir + " RIR" : "RIR"}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  style={{
                    maxHeight: "150px",
                    minWidth: "75px",
                    maxWidth: "75px",
                    padding: 0,
                  }}
                >
                  <List
                    style={{ height: 150, width: "100%" }}
                    rowComponent={RirRow}
                    rowCount={10}
                    rowHeight={35}
                    rowProps={{
                      exIndex,
                      setIndex,
                      updateFn: (
                        exIndex,
                        setIndex,
                        val,
                      ) => {
                        updateSet(
                          exIndex,
                          setIndex,
                          (prev) => ({ ...prev, rir: val })
                        );
                      },
                    }}
                  />
                </Dropdown.Menu>
              </Dropdown>
              <InputGroup.Text
                className={
                  theme === "light"
                    ? "bg-body-secondary text-dark border-secondary-subtle"
                    : "bg-dark-subtle text-white"
                }
              >
                {" "}
                Optional{" "}
              </InputGroup.Text>
            </InputGroup>
          </div>
          {/* Delete Button */}
            <Button
              className="me-4"
              variant="danger"
              onClick={() => deleteSet(exIndex, setIndex)}
            >
              <Trash />
            </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SetDisplay;
