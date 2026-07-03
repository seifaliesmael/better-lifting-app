import { useState } from 'react'
import CreateExercise from './Pages/Create/CreateExercise';
import ExerciseList from './Pages/Lists/ExerciseList';
import MuscleList from './Pages/Lists/MuscleList';
import Navbar from './Components/Navbar';
import WorkoutList from './Pages/Lists/WorkoutList';
import CreateWorkout from './Pages/Create/CreateWorkout';
import { Card } from 'react-bootstrap';


function App() {
  const [currView, setCurrView] = useState("Default")

  const renderBody = () => {
    switch(currView) {
      case 'exercises':
        return <ExerciseList />;
      case 'musclegroups':
        return <MuscleList />;
      case 'workouts':
          return <WorkoutList />;
      case 'createExercise':
        return <CreateExercise />;
      case 'createWorkout':
        return <CreateWorkout />;
      default:
        return <p> Default View </p>;
    }
  }

  return (
    <div className="p-4">
      <h1 className="fw-bold"> MesoPal </h1>
      <p className="fs-5" style={{fontStyle:"italic"}}> A better lifting app </p>

      <Navbar updateFn={setCurrView} />

      <div className="container d-flex justify-content-center mt-5">
        {renderBody()}
      </div>
      
    </div>
  ); 
}

export default App
