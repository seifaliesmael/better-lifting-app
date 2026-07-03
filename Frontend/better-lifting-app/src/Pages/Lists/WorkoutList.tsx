import type { Workout } from '../../Components/Interfaces';
import { useQuery } from '@tanstack/react-query';
import { ListRender } from '../../Components/Rendering';
import { Card, Row, Col } from 'react-bootstrap';

const fetchAllWorkouts = async (): Promise<Workout[]> => {
    const response = await fetch('http://localhost:5240/api/workouts');
    if (!response.ok) throw new Error('Network error');
    return response.json();
};

const WorkoutList = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['fetchAllWorkouts'],
        queryFn: fetchAllWorkouts,
        retry: false
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data) return <p>No workouts in DB. </p>;

    return (
        <ListRender
            data={data}
            title="Workouts"
            renderData={
                (w) => (
                    <>
                        <Card.Title> <h4> {w.name} </h4> </Card.Title>
                        <hr />
                        {w.workoutExercises.map((we, exIndex) => (
                            <div key={exIndex} className="mt-4 mb-2">
                                <h5> {we.name}</h5>
                                {we.workoutSets.map((set, setIndex) => (
                                    <Card key={setIndex} className="mt-2 ms-3">
                                        <Card.Body style={{ background: "#eeeeee", padding: "10px" }}>
                                            <Card.Title style={{ fontSize: "1rem" }}> 
                                                Set {setIndex + 1} 
                                            </Card.Title>
                                            <Row>
                                                <Col>
                                                    <Card.Text> Reps: {set.reps} </Card.Text>
                                                </Col>
                                                <Col>
                                                    <Card.Text> Weight: {set.weight} KG </Card.Text>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        ))}
                    </>
                )
            }
        />
    )
}

export default WorkoutList;