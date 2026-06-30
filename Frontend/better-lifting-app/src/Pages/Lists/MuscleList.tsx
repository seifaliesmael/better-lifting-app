import { useQuery } from '@tanstack/react-query';
import { ListRender } from '../../Components/Rendering';
import { Card } from 'react-bootstrap';
import type { MuscleGroup } from '../../Components/Interfaces';


const fetchAllMuscleGroups = async (): Promise<MuscleGroup[]> => {
  const response = await fetch('http://localhost:5240/api/musclegroups');
  if (!response.ok) throw new Error('Network error');
  return response.json();
};

const MuscleList = () => {
  const { data, isLoading, error} = useQuery({
    queryKey: ['fetchMuscleGroups'],
    queryFn: fetchAllMuscleGroups,
    retry: false
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data found for muscle groups</p>;

  return (
    <ListRender 
      data={data} 
      title="Muscle Groups"
      renderData= {
        (m) => (
          <>
            <Card.Title> <h4> {m.name} </h4> </Card.Title>
            <Card.Text> Placeholder description</Card.Text>
          </>
        )
      }
    />
  );
}

export default MuscleList