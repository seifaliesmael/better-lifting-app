import type { WOResponse } from "../../Data/Responses";
import { ListRender } from "../../Components/Display/ListRenderer";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useContext, useState } from "react";
import { ThemeContext } from "../../contexts/theme/ThemeContext";
import WorkoutDisplay from "../../Components/Display/WorkoutDisplay";
import { fetchAllWorkouts } from "../../api/dataServices";

const WorkoutList = () => {
  const workoutListResponse = fetchAllWorkouts(1);
  const [showWorkout, setShowWorkout] = useState<boolean>(false);
  const [currWorkout, setCurrWorkout] = useState<WOResponse | undefined>(
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

  return (
    <>
      <WorkoutDisplay showWorkout={showWorkout} setShowWorkout={setShowWorkout} theme={theme} currWorkout={currWorkout}/>
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
                <Card.Text>Date: {new Date(w.start).toDateString()}</Card.Text>
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
