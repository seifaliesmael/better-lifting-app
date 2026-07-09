import { useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import { Check2Square, Square } from 'react-bootstrap-icons';
import type { MuscleResponse } from '../../Data/Responses';
import type { ExRequest } from '../../Data/Requests';
import { equipmentTypes } from '../../Data/LocalData';
import { fetchAllMuscleGroups } from '../../api/dataServices';

interface SelectedMuscleGroup extends MuscleResponse {
  selected: boolean,
}
const CreateExercise = () => {
  const muscleGroupsResult = fetchAllMuscleGroups();

  if (muscleGroupsResult.isLoading) return <p>Loading...</p>;
  if (muscleGroupsResult.error) return <p>Error: {muscleGroupsResult.error.message}</p>;


  const [exName, setExName] = useState("");
  const [exType, setExType] = useState(-1);
  const [musclesSelected, setMusclesSelected] = useState<number[]>([]);

  const toggleMuscleSelected = (id: number) => {
    setMusclesSelected(prev =>
      prev.includes(id) ? prev.filter(x => x != id)
        : [...prev, id]
    );
  }

  const muscleGroupsSelected: SelectedMuscleGroup[] =
    muscleGroupsResult.data?.map((m: MuscleResponse) =>
      ({ ...m, selected: musclesSelected.includes(m.id) })) || [];

  const activeMuscleGroups: MuscleResponse[] =
    muscleGroupsResult.data?.filter(m => musclesSelected.includes(m.id)) || [];

  const newEx: ExRequest = ({ exerciseName: exName, muscleGroupIDs: musclesSelected, equipmentType: exType });

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
    <Dropdown className="mt-4">
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
    <Dropdown className="mt-4" autoClose="outside">
      <Dropdown.Toggle variant={activeMuscleGroups.length == 0 ? "secondary" : "success"} id="dropdown-muscles">
        Muscle Groups
      </Dropdown.Toggle>

      <Dropdown.Menu style={{
        maxHeight: "200px",
        overflowY: "auto",
      }}>
        {muscleGroupsSelected.map(
          (m: SelectedMuscleGroup) =>
            <Dropdown.Item key={m.id} onClick={() => toggleMuscleSelected(m.id)}>
              {m.selected ? <Check2Square className="me-2" /> : <Square className="me-2" />} {m.name}
            </Dropdown.Item>
        )
        }
      </Dropdown.Menu>
    </Dropdown>
  )

  const postData = async (newEx: ExRequest) => {
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