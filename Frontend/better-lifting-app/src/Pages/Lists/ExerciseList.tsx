import { ListRender } from '../../Components/Display/ListRenderer';
import { Card } from 'react-bootstrap';
import { equipmentTypes } from '../../Data/LocalData';
import { fetchAllExercises } from '../../api/dataServices';

const ExerciseList = () => {
  const { data, isLoading, error} = fetchAllExercises();

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