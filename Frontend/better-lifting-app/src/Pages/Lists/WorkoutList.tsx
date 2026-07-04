import type { Workout } from "../../Components/Interfaces";
import { useQuery } from "@tanstack/react-query";
import { ListRender } from "../../Components/Rendering";
import { Card, Row, Col, Button, Modal } from "react-bootstrap";
import { useContext, useState } from "react";
import { ThemeContext } from "../../contexts/theme/ThemeContext";

const fetchAllWorkouts = async (): Promise<Workout[]> => {
  const response = await fetch("http://localhost:5240/api/workouts");
  if (!response.ok) throw new Error("Network error");
  return response.json();
};

const WorkoutList = () => {
  const workoutListResponse = useQuery({
    queryKey: ["fetchAllWorkouts"],
    queryFn: fetchAllWorkouts,
    retry: false,
  });

  const [showWorkout, setShowWorkout] = useState<boolean>(false);
  const [currWorkout, setCurrWorkout] = useState<Workout | undefined>(
    undefined,
  );
  const { theme } = useContext(ThemeContext);

  if (workoutListResponse.isLoading) return <p>Loading...</p>;
  if (workoutListResponse.error)
    return <p>Error: {workoutListResponse.error.message}</p>;
  if (!workoutListResponse.data) return <p>No workouts in DB. </p>;

  const handleShow = () => {
    setShowWorkout(true);
  };
  const handleClose = () => {
    setShowWorkout(false);
  };

  const workoutDisplay = (
    <Modal
      show={showWorkout}
      onHide={handleClose}
      data-bs-theme={theme}
      contentClassName={
        theme === "light" ? "bg-white text-dark" : "bg-dark-subtle text-white"
      }
    >
      <Modal.Header closeButton>
        <Modal.Title> {currWorkout?.name} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currWorkout?.workoutExercises.map((we, exIndex) => (
          <div key={exIndex} className={exIndex != 0 ? "mt-4" : ""}>
            <h5> {we.name}</h5>
            {we.workoutSets.map((set, setIndex) => (
              <Card key={setIndex} className="mt-2 ms-3">
                <Card.Body style={{padding: "10px"}}>
                  <Card.Title style={{ fontSize: "1rem" }}>
                    Set {setIndex + 1}
                  </Card.Title>
                  <Row>
                    <Col>
                      <Card.Text> Reps: {set.reps} </Card.Text>
                    </Col>
                    <Col>
                      <Card.Text> Weight: {set.weight} kg </Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
  return (
    <>
      {workoutDisplay}
      <ListRender
        data={workoutListResponse.data}
        title="Workouts"
        rowHeight={150}
        onClick={(w) => {
          setCurrWorkout(w);
          handleShow();
        }}
        renderData={(w) => (
          <>
            <Card.Title>
              <h4> {w.name} </h4>
            </Card.Title>
            <hr />
            <Row>
              <Col>
                <Card.Text>
                  Date: {new Date(w.start).toDateString()}
                </Card.Text>
              </Col>
              <Col className="text-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setCurrWorkout(w);
                    handleShow();
                  }}
                >
                  Show Details
                </Button>
              </Col>
            </Row>
          </>
        )}
      />
    </>
  );
};

export default WorkoutList;
