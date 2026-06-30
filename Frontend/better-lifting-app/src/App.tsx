import { useState } from 'react'
import CreateExercise from './Pages/Create/CreateExercise';
import ExerciseList from './Pages/Lists/ExerciseList';
import MuscleList from './Pages/Lists/MuscleList';


function App() {
  const [currView, setCurrView] = useState("Default")

  const renderBody = () => {
    switch(currView) {
      case 'exercises':
        return <ExerciseList />;
      case 'musclegroups':
        return <MuscleList />;
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

      <div className="container d-flex justify-content-center mt-5">
        {renderBody()}
      </div>
      
    </div>
  ); 
}

export default App
