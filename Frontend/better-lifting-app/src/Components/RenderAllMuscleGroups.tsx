import { useQuery } from "@tanstack/react-query";
import { Container, Row, Col, Card } from "react-bootstrap";

interface MuscleGroup {
  id: number,
  name: string
}

const fetchAllMuscleGroups = async (): Promise<MuscleGroup[]> => {
  const response = await fetch('http://localhost:5240/api/musclegroups');
  if (!response.ok) throw new Error('Network error');
  return response.json();
};


const RenderAllMuscleGroups = () => {
  const { data, isLoading, error} = useQuery({
    queryKey: ['fetchMuscleGroups'],
    queryFn: fetchAllMuscleGroups,
    retry: false
  });


  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1> Muscle Groups </h1>
      <Container>
        <Row>
          {data?.map((muscleGroup) => (
            <Col key={muscleGroup.id}>
              <Card>
                <Card.Body>
                  <Card.Title> ID: {muscleGroup.id} </Card.Title>
                  <Card.Text> Name: {muscleGroup.name} </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  ); 
}

export default RenderAllMuscleGroups