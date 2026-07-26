import { type Dispatch, type SetStateAction } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import SetDisplay from "./SetDisplay";
import { ArrowDown, ArrowUp, GripVertical, Trash } from "react-bootstrap-icons";
import type { LocalWorkoutExercise, LocalWorkoutSet } from "../../Data/LocalData";
import { useSortable } from "@dnd-kit/react/sortable";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

interface Props {
  workoutExercises: LocalWorkoutExercise[];
  setWorkoutExercises: Dispatch<
    SetStateAction<LocalWorkoutExercise[]>
  >;
  ex: LocalWorkoutExercise;
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
  // For drag and drop
    const {ref, handleRef} = useSortable({id:ex.id, index:exIndex});

  // Helpers
  const deleteEx = (): void => {
    if (!workoutExercises) return;
    if (!workoutExercises[exIndex]) return;

    const newExercises = workoutExercises.filter(
      (_, index) => index != exIndex,
    );
    setWorkoutExercises(newExercises);
  };

  const addSet = (): void => {
    setWorkoutExercises((prev) => {
      const oldEx = prev[exIndex];
      if (!oldEx) return prev;

      const newSet: LocalWorkoutSet = {
        order: oldEx.workoutSets.length,
        weight: -1,
        reps: -1,
        type: 1, // Normal set by default 
        id:crypto.randomUUID()
      };

      const newExercises = [...prev];
      newExercises[exIndex] = {
        ...oldEx,
        workoutSets: [...oldEx.workoutSets, newSet],
      };

      return newExercises;
    });
  };

  // Move exercises up/down by one
  const handleExMove = (direction:"up" | "down", exIndex:number) => {
    // Edge cases
    if ((direction === "up") && (exIndex === 0)) return; 
    if ((direction === "down") && (exIndex === workoutExercises.length - 1)) return;

    setWorkoutExercises((prev) => {
      const newExercises = [...prev]
            
      // Swap with previous element
      if (direction === "up") {
        [newExercises[exIndex], newExercises[exIndex-1]] = [newExercises[exIndex-1], newExercises[exIndex]];
      }
      // Swap with next element
      else {
        [newExercises[exIndex], newExercises[exIndex+1]] = [newExercises[exIndex+1], newExercises[exIndex]];
      }

      return newExercises;
    })
  }

  // Drag and drop sets
  const handleSetDrag = (event: DragEndEvent) => {
    if (event.canceled) {console.log("Event canceled"); return;};
    try {
      setWorkoutExercises((prev) => {
        const newExercises = [...prev];
        const currentEx = newExercises[exIndex];
        // if (!currentEx) return prev;

        const newSets = move(currentEx.workoutSets, event);
        newExercises[exIndex] = { ...currentEx, workoutSets: newSets };

        return newExercises;
      });
    } catch (err) {
      console.log("Error in set drag and drop:", err);
    }
  };


  return (
    <Card
      key={ex.id} 
      ref={ref}
      style={{touchAction: "none"}}
      className={`mt-4 rounded-3 ${
        theme === "light"
          ? "bg-body-tertiary text-dark"
          : "bg-dark-subtle text-white"
      }`}
    >
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center"> 
        <span> {ex.exerciseName} </span>

        {/* Buttons */}
        <div className="d-flex">
          
          {/* Move up button */}
          <Button style={{background:"none",borderStyle:"none", color:(theme == "light" ? "black" : "white")}} onClick={() => handleExMove("up", exIndex)}> <ArrowUp /> </Button>
          {/* Move down button */}
          <Button style={{background:"none",borderStyle:"none", color:(theme == "light" ? "black" : "white")}} onClick={() => handleExMove("down", exIndex)}> <ArrowDown /> </Button>
          {/* Drag Handle */}
          <div ref={handleRef} style={{ cursor: "grab", touchAction: "none" }} className="p-2">
            <GripVertical size={20} />

          </div>
        </div>
        </Card.Title>
        {ex.workoutSets.length > 0 ? (
          <DragDropProvider onDragEnd={handleSetDrag}>
            <ul className="list-unstyled mb-0">
              {ex.workoutSets.map((set, index) => (
                <SetDisplay
                  key={set.id}
                  set={set}
                  setIndex={index}
                  exIndex={exIndex}
                  theme={theme}
                  workoutExercises={workoutExercises}
                  setWorkoutExercises={setWorkoutExercises}
                />
              ))}
            </ul>
          </DragDropProvider>
        ) : (
          <Card.Text> No sets added to this exercise </Card.Text>
        )}

        <Row>
          <Col>
            <Button className="mt-4" onClick={() => addSet()}>
              Add Set
            </Button>
          </Col>
          <Col className="text-end">
            <Button
              className="me-4 mt-4"
              variant="danger"
              onClick={() => deleteEx()}
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
