import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Dropdown } from 'react-bootstrap'

interface Exercise {
  exerciseName: string,
  muscleGroups: number[],
  equipmentType: number
}
interface MuscleGroup {
  id: number,
  name: string
}

interface SelectedMuscleGroup {
  id: number,
  selected: boolean,
  name: string
}
const equipmentTypes:string[] = ["Barbell", "Straight Bar", "Dumbbell", "Machine"]

const CreateExercise = () => {
    const fetchAllMuscleGroups = async (): Promise<MuscleGroup[]> => {
    const response = await fetch('http://localhost:5240/api/musclegroups');
    if (!response.ok) throw new Error('Network error');
    return response.json();
    };
    
    const muscleGroupsResult = useQuery({
    queryKey: ['fetchMuscleGroups'],
    queryFn: fetchAllMuscleGroups,
    retry: false
  });
  
  const [exName, setExName] = useState("");
  const [exType, setExType] = useState(-1);
  const [musclesSelected, setMusclesSelected] = useState<number[]>([]);

  const updateMuscleGroups = (id:number) => {
    setMusclesSelected(prev => 
        prev.includes(id) ? prev.filter(x => x != id)
        : [...prev, id]
      );
  }
  
  function handleChangeName(e:any) {
      setExName(e.target.value);
  }
  
  if (muscleGroupsResult.isLoading) return <p>Loading...</p>;
  if (muscleGroupsResult.error) return <p>Error: {muscleGroupsResult.error.message}</p>;

  const muscleGroupsSelected: SelectedMuscleGroup[] =
    muscleGroupsResult.data?.map((m:MuscleGroup) => 
      ({...m, selected:musclesSelected.includes(m.id)})) || [];

  const activeMuscleGroups:MuscleGroup[] =
    muscleGroupsResult.data?.filter(m => musclesSelected.includes(m.id)) || [];

  const newEx:Exercise = ({exerciseName:exName, muscleGroups:musclesSelected, equipmentType:exType});

  return (
  <div className = "container mt-4">
    {/* {muscleGroupsSelected.map((m:SelectedMuscleGroup) => <p key={m.id}> {m.id}: {m.name} - {m.selected ? "Selected" : "Unselected"} </p>)} */}
      <h1> Create Exercise </h1>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <form>
                <div className="form-group">
                    <label htmlFor="exerciseName"> Exercise Name </label>
                    <input type="text" className="form-control" value={exName} onChange={handleChangeName}/>
                </div>
                <Dropdown className="mt-4 btn-primary">
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    Equipment Type
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {equipmentTypes.map((str, index) => 
                      <Dropdown.Item onClick={() => setExType(index)}> {str} </Dropdown.Item>
                      )}
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="mt-4 btn-primary" autoClose="outside">
                  <Dropdown.Toggle variant="secondary" id="dropdown-muscles">
                    Muscle Groups
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {muscleGroupsSelected.map((m:SelectedMuscleGroup) => 
                      <Dropdown.Item key={m.id} onClick={() => updateMuscleGroups(m.id)}> {m.selected ? <i className="bi bi-check2-square"> </i> : <i className="bi bi-square"></i>} {m.name} </Dropdown.Item>
                      )}
                  </Dropdown.Menu>
                </Dropdown>
            </form>
          </div>
          <div className="col-6">
              <h2> {exName == "" ? "Untitled Exercise" : exName}</h2>
              <h5> Equipment Type </h5>
              <p> {exType == -1 ? "Unselected" : equipmentTypes[exType]} </p>
              <h5> Muscle Groups </h5>
              <p> {activeMuscleGroups.length != 0 ? activeMuscleGroups.map(m => m.name).join(", ") : "None selected"}</p>
              <h5> [DEV: POST Output]</h5>
              {JSON.stringify(newEx)}
          </div>
        </div>
      </div>
  </div>

  )
}

export default CreateExercise