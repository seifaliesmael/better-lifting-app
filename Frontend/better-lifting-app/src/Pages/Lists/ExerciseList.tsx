import { useQuery } from '@tanstack/react-query';
import type { Exercise } from '../../Components/Interfaces';
import { equipmentTypes } from '../../Components/Interfaces';
import { ListRender } from '../../Components/Rendering';
import { Card } from 'react-bootstrap';


const fetchAllExercises = async (): Promise<Exercise[]> => {
  const response = await fetch('http://localhost:5240/api/exercises');
  if (!response.ok) throw new Error('Network error');
  return response.json();
};

const ExerciseList = () => {
    const { data, isLoading, error} = useQuery({
    queryKey: ['fetchExercises'],
    queryFn: fetchAllExercises,
    retry: false
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No exercises found</p>;

  return (
    <ListRender 
      data={data} 
      title="Exercises"
      rowHeight={175}
      renderData= {
          (e) => (
            <>
              <Card.Title> 
                <h4> {e.exerciseName} </h4> 
              </Card.Title>
              <Card.Text> Equipment Type: {equipmentTypes[e.equipmentType]} </Card.Text>
              <Card.Text> Muscle Groups: <br /> {e.muscleGroups.length > 0 ? e.muscleGroups.map(m => m.name).join(", ") : "No Muscle Groups Defined"} </Card.Text>
            </>
        )
      }
    />
  );
}

export default ExerciseList