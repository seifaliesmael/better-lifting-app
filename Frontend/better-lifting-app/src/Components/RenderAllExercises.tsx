import { useQuery } from '@tanstack/react-query';
import {Card, Col, Container, Row } from 'react-bootstrap'

interface Exercise {
  id: number,
  exerciseName: string,
  muscleGroups: MuscleGroup[]
  equipmentType: number
}
interface MuscleGroup {
  id: number,
  name: string
}

const fetchAllExercises = async (): Promise<Exercise[]> => {
  const response = await fetch('http://localhost:5240/api/exercises');
  if (!response.ok) throw new Error('Network error');
  return response.json();
};

const RenderAllExercises = () => {
  const { data, isLoading, error} = useQuery({
    queryKey: ['fetchExercises'],
    queryFn: fetchAllExercises,
    retry: false
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1> Exercises </h1>
      <Container>
        <Row>
          {data?.map((exercise) => (
            <Col key={exercise.id}>
              <Card>
                <Card.Body>
                  <Card.Title> Exercise ID: {exercise.id} </Card.Title>
                  <Card.Text> Exercise Name: {exercise.exerciseName} </Card.Text>
                  <Card.Text> Equipment Type: {exercise.equipmentType} </Card.Text>
                  <Card.Text> Muscle Groups: <br/> {exercise.muscleGroups.map(m => m.name).join(", ")} </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  ); 
}

export default RenderAllExercises