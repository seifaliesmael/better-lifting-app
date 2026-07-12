import { useContext, useState } from 'react'
import CreateExercise from './Pages/Create/CreateExercise';
import ExerciseList from './Pages/Lists/ExerciseList';
import MuscleList from './Pages/Lists/MuscleList';
import Navbar from './Components/Navbar';
import WorkoutList from './Pages/Lists/WorkoutList';
import CreateWorkout from './Pages/Create/CreateWorkout';
import { ThemeContext } from './contexts/theme/ThemeContext';
import { Button, Col, Row } from 'react-bootstrap';

function App() {
  const [currView, setCurrView] = useState("Default")
  const {theme, toggleTheme} = useContext(ThemeContext);

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
    <div data-bs-theme={theme} className={`p-4 min-vh-100 ${theme === "light" ? "bg-body-secondary text-dark" : "bg-dark-subtle text-white"}`}>
      <Row className="align-items-center">
        <Col>
          <h1 className="fw-bold mb-0"> MesoPal </h1>
          <p className="fs-5" style={{fontStyle:"italic"}}> A better lifting app </p>
        </Col>
        <Col className="text-end me-4">
          <Button onClick={toggleTheme}> Toggle Theme </Button>
        </Col>
      </Row>

      <Navbar updateFn={setCurrView} />

      <div className="container d-flex justify-content-center mt-5">
        {renderBody()}
      </div>
      
    </div>
  ); 
}

export default App
