import { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap';
import RenderAllExercises from './Components/RenderAllExercises';
import RenderAllMuscleGroups from './Components/RenderAllMuscleGroups';


function App() {
  const [currView, setCurrView] = useState("Default")

  const renderBody = () => {
    switch(currView) {
      case 'exercises':
        return <RenderAllExercises/>;
      case 'musclegroups':
        return <RenderAllMuscleGroups/>;
      default:
        return <p> Default View </p>;
    }
  }

  return (
    <div className="p-4">
      <h1> Hello World </h1>
      <div className="container">
        <div className= "row">
          <div className = "col-2">
            <Button onClick={() => setCurrView("exercises")}> Get Exercises </Button>
          </div>
          <div className = "col-2"><Button onClick={() => setCurrView("musclegroups")}> Get Muscle Groups </Button></div>
        </div>
      </div>
      <div>
        {renderBody()}
      </div>
    </div>
  ); 
}

export default App
