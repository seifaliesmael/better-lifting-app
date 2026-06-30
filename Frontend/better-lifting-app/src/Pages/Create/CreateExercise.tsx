import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import { equipmentTypes, type MuscleGroup } from "../../Components/Interfaces";

interface SelectedMuscleGroup extends MuscleGroup {
  selected: boolean,
}

interface CreateExercisePayload {
  exerciseName: string,
  muscleGroupIDs: number[]
  equipmentType: number
}
const CreateExercise = () => {

  // Load Data
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

  const updateMuscleGroups = (id: number) => {
    setMusclesSelected(prev =>
      prev.includes(id) ? prev.filter(x => x != id)
        : [...prev, id]
    );
  }


  if (muscleGroupsResult.isLoading) return <p>Loading...</p>;
  if (muscleGroupsResult.error) return <p>Error: {muscleGroupsResult.error.message}</p>;

  // End Load Data

  const muscleGroupsSelected: SelectedMuscleGroup[] =
    muscleGroupsResult.data?.map((m: MuscleGroup) =>
      ({ ...m, selected: musclesSelected.includes(m.id) })) || [];

  const activeMuscleGroups: MuscleGroup[] =
    muscleGroupsResult.data?.filter(m => musclesSelected.includes(m.id)) || [];

  const newEx: CreateExercisePayload = ({ exerciseName: exName, muscleGroupIDs: musclesSelected, equipmentType: exType });

  function handleChangeName(e: any) {
    setExName(e.target.value);
  }
  const createReady = () => {
    return (
      activeMuscleGroups.length > 0 &&
      exType != -1 &&
      exName != ""
    )
  }


  const equipmentSelect = (
    <Dropdown className="mt-4 btn-primary">
      <Dropdown.Toggle variant={exType == -1 ? "secondary" : "success"} id="dropdown-basic">
        Equipment Type
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {equipmentTypes.map((str, index) =>
          <Dropdown.Item key={index} onClick={() => setExType(index)}> {str} </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )

  const musclesSelect = (
    <Dropdown className="mt-4 btn-primary" autoClose="outside">
      <Dropdown.Toggle variant={activeMuscleGroups.length == 0 ? "secondary" : "success"} id="dropdown-muscles">
        Muscle Groups
      </Dropdown.Toggle>

      <Dropdown.Menu style={{
        maxHeight: "200px",
        overflowY: "auto",
      }}>
        {muscleGroupsSelected.map(
          (m: SelectedMuscleGroup) =>
            <Dropdown.Item key={m.id} onClick={() => updateMuscleGroups(m.id)}>
              {m.selected ? <i className="bi bi-check2-square"> </i> : <i className="bi bi-square"></i>} {m.name}
            </Dropdown.Item>
        )
        }
      </Dropdown.Menu>
    </Dropdown>
  )

  const postData = async (newEx: CreateExercisePayload) => {
    try {
      const response = await fetch('http://localhost:5240/api/exercises',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newEx),
        }
      );

      if (!response.ok) throw new Error('Network error');
      const result = await response.json();
      console.log("Successfully created:", result)

      setExName("");
      setExType(-1);
      setMusclesSelected([]);
      return result;
    }

    catch (err) {
      console.error("Failed to create exercise", err)
    }

  };

  const createButton = <Button variant="success" onClick={() => postData(newEx)}> Create Exercise </Button>
  const missingFields = (): string[] => {
    const fields = [];
    if (exName == "") {
      fields.push("Exercise Name")
    }
    if (exType == -1) {
      fields.push("Equpment Type")
    }
    if (activeMuscleGroups.length == 0) {
      fields.push("Muscle Groups")
    }
    return fields;
  }
  const disabledCreateButton = ( 
    <>
      <p> Please fill out required fields: <br/> {missingFields().join(", ")}</p>
      <Button variant="success" disabled> Create Exercise </Button>
    </>
  )

  return (
    <div className="container mt-4">
      <h1> Create Exercise </h1>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <form>
              <div className="form-group">
                <label htmlFor="exerciseName"> Exercise Name </label>
                <input type="text" className="form-control" value={exName} onChange={handleChangeName} />
              </div>

              {equipmentSelect}

              {musclesSelect}
            </form>
          </div>

          {/* Display (right column) */}
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
        {createReady() ? createButton : disabledCreateButton}
      </div>
    </div>

  )
}

export default CreateExercise