import { type Dispatch, type SetStateAction } from 'react'
import { Button, Card, Col, Modal, Row } from 'react-bootstrap'
import type { WOResponse } from '../../Data/Responses';

interface Props {
    showWorkout:boolean;
    setShowWorkout:Dispatch<SetStateAction<boolean>>;
    theme:string;
    currWorkout: WOResponse | undefined;
    
}


const WorkoutDisplay = ({showWorkout, setShowWorkout, theme, currWorkout}:Props) => {

const handleClose = () => {setShowWorkout(false)}

  return (
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
        {currWorkout?.notes ? (
          <Card className="mb-4">
            <Card.Body>
              <Card.Subtitle className="fw-bold"> Notes </Card.Subtitle>
              <Card.Text> {currWorkout?.notes} </Card.Text>
            </Card.Body>
          </Card>
        ) : null}

        {currWorkout?.workoutExercises.map((we, exIndex) => (
          <div key={exIndex} className={exIndex != 0 ? "mt-4" : ""}>
            <h5> {we.exerciseName}</h5>
            {we.workoutSets.map((set, setIndex) => (
              <Card key={setIndex} className="mt-2 ms-3">
                <Card.Body style={{ padding: "10px" }}>
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
                    <Col>
                      {set.rir ? <Card.Text> {"RIR: " + set.rir} </Card.Text> : "RIR: N/A"}
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
  )
}

export default WorkoutDisplay