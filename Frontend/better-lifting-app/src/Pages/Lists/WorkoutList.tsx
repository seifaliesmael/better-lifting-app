import type { Workout } from '../../Components/Interfaces';
import { useQuery } from '@tanstack/react-query';
import { ListRender } from '../../Components/Rendering';
import { Card } from 'react-bootstrap';

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
                        <Card.Text> Number of sets: {w.workoutExercises.length} </Card.Text>
                    </>
                )
            }
        />
    )
}

export default WorkoutList