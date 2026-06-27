import { useState } from 'react'
import RenderAllExercises from './Components/RenderAllExercises';
import RenderAllMuscleGroups from './Components/RenderAllMuscleGroups';
import CreateExercise from './Components/CreateExercise';


function App() {
  const [currView, setCurrView] = useState("Default")

  const renderBody = () => {
    switch(currView) {
      case 'exercises':
        return <RenderAllExercises />;
      case 'musclegroups':
        return <RenderAllMuscleGroups />;
      case 'createExercise':
        return <CreateExercise />
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
            <div className="btn btn-primary" onClick={() => setCurrView("exercises")}> Get Exercises </div>
          </div>
          <div className = "col-2">
            <div className="btn btn-primary" onClick={() => setCurrView("musclegroups")}> Get Muscle Groups </div>
          </div>
          <div className = "col-2">
            <div className="btn btn-primary" onClick={() => setCurrView("createExercise")}> Create New Exercise </div>
          </div>
        </div>
      </div>  
      <div>
        {renderBody()}
      </div>
    </div>
  ); 
}

export default App
