import { ListRender } from '../../Components/Display/ListRenderer';
import { Card } from 'react-bootstrap';
import { fetchAllMuscleGroups } from '../../api/dataServices';

const MuscleList = () => {
  const { data, isLoading, error } = fetchAllMuscleGroups();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data found for muscle groups</p>;

  return (
    <ListRender
      data={data}
      title="Muscle Groups"
      rowHeight={100}
      renderData={
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