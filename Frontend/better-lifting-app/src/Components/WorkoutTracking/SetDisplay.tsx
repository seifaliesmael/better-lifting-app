import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { ArrowDown, ArrowUp, GripHorizontal, Trash } from "react-bootstrap-icons";
import { List, type RowComponentProps } from "react-window";
import type { Dispatch, SetStateAction } from "react";
import type { LocalWorkoutExercise, LocalWorkoutSet } from "../../Pages/Create/CreateWorkout";
import { useSortable } from "@dnd-kit/react/sortable";

interface Props {
  workoutExercises: LocalWorkoutExercise[];
  setWorkoutExercises: Dispatch<
    SetStateAction<LocalWorkoutExercise[]>
  >;
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

  const {ref, handleRef} = useSortable({id:set.id, index:setIndex});

  const updateSetReps = (
    exIndex: number,
    setIndex: number,
    newReps: number,
  ): void => {
    if (!workoutExercises) return;
    const newExercises = [...workoutExercises];

    if (!newExercises[exIndex]) return;
    const oldEx = newExercises[exIndex];
    const newEx: LocalWorkoutExercise = {
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
    const newEx: LocalWorkoutExercise = {
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
  const handleSetMove = (direction:"up" | "down", setIndex:number) => {

    // Edge cases
    if ((direction === "up") && (setIndex === 0)) return; 
    if ((direction === "down") && (setIndex === workoutExercises[exIndex].workoutSets.length - 1)) return;

    setWorkoutExercises((prev) => {
      const newExercises = [...prev]
      const newEx = { ...newExercises[exIndex] };
      const newSets = [...newEx.workoutSets];
      
      // Swap with previous element
      if (direction === "up") {
        [newSets[setIndex], newSets[setIndex-1]] = [newSets[setIndex-1], newSets[setIndex]];
      }
      // Swap with next element
      else {
        [newSets[setIndex], newSets[setIndex+1]] = [newSets[setIndex+1], newSets[setIndex]];
      }

      newEx.workoutSets = newSets;
      newExercises[exIndex] = newEx;
      return newExercises;
    })
  }

  return (
    <Card
      ref={ref}
      key={setIndex}
      style={{touchAction: "none" }}
      className={`mt-2 ${
        theme === "light"
          ? "bg-body-secondary text-dark"
          : "bg-dark-subtle text-white"
      }`}
    >
      <Card.Body>
        <Card.Title className="d-flex justify-content-between"> 
          <span>
            Set {setIndex + 1} 
          </span>
          <div className="d-flex">
            {/* Move up button */}
            <Button style={{background:"none",borderStyle:"none", color:(theme == "light" ? "black" : "white")}} onClick={() => handleSetMove("up", setIndex)}> <ArrowUp /> </Button>
            {/* Move down button */}
            <Button style={{background:"none",borderStyle:"none", color:(theme == "light" ? "black" : "white")}} onClick={() => handleSetMove("down", setIndex)}> <ArrowDown /> </Button>
            {/* Drag Handle */}
            <div ref={handleRef} style={{ cursor: "grab", touchAction: "none" }} className="p-2">
              <GripHorizontal size={20} />
            </div>
          </div>
          </Card.Title>

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
