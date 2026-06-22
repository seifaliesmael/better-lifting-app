import { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useQuery } from '@tanstack/react-query';
import './App.css'

interface Exercise {
  id: number,
  exerciseName: string
}

const fetchData = async (): Promise<Exercise[]> => {
  const response = await fetch('http://localhost:5240/api/exercises');
  if (!response.ok) throw new Error('Network error');
  return response.json();
};

function App() {
  const { data, isLoading, error} = useQuery({
    queryKey: ['testing'],
    queryFn: fetchData,
    retry: false
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Backend Data Test</h1>
      <Container>
        <Row>
          {data?.map((exercise) => (
            <Col key={exercise.id}>
              <Card>
                <Card.Title> Exercise ID: {exercise.id} </Card.Title>
                <Card.Text> Exercise Name: {exercise.exerciseName} </Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  ); 
}

export default App
