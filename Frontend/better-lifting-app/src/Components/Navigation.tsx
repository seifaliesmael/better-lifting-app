import { Row, Col, Container, Button } from "react-bootstrap";
import CreateExercise from "../Pages/Create/CreateExercise";
import CreateWorkout from "../Pages/Create/CreateWorkout";
import ExerciseList from "../Pages/Lists/ExerciseList";
import MuscleList from "../Pages/Lists/MuscleList";
import WorkoutList from "../Pages/Lists/WorkoutList";
import LoginPage from "../Pages/Auth/LoginPage";
import RegisterPage from "../Pages/Auth/RegisterPage";
import { attemptLogout, checkLoggedIn } from "../api/authServices";

interface Props {
  updateView: (page: string) => void;
}

interface NavButtonProps {
  text: string;
  navTarget: string;
}

const Navbar = ({ updateView }: Props) => {
  const NavButton = ({ text, navTarget }: NavButtonProps) => (
    <Col>
      <Button variant="primary" onClick={() => updateView(navTarget)}>
        {" "}
        {text}{" "}
      </Button>
    </Col>
  );

  const authResponse = checkLoggedIn();
  if (authResponse.data) console.log("User is logged in: " + authResponse.data.email);
  const {mutate} = attemptLogout();

  const handleLogout = () => mutate({updateView});
  return (
    <Container>
      <Row>
        <NavButton text="View Exercises" navTarget="exercisesPage" />
        <NavButton text="View Muscle Groups" navTarget="musclegroupsPage" />
        <NavButton text="View Workouts" navTarget="workoutsPage" />
        <NavButton navTarget="createExercisePage" text="Create New Exercise" />
        <NavButton navTarget="createWorkoutPage" text="New Workout" />
        {authResponse.data ? (
          <Col>
            <Button
              variant="primary"
              onClick={() => {
                handleLogout();
              }}
            >
              {" "}
              Log Out{" "}
            </Button>
          </Col>
        ) : <>
          <NavButton text="Login" navTarget="loginPage" />
          <NavButton text="Register" navTarget="registerPage" />
        </>}
      </Row>
    </Container>
  );
};

export const handleNav = (
  route: string,
  updateView: (page: string) => void,
) => {
  switch (route) {
    case "exercisesPage":
      return <ExerciseList />;
    case "musclegroupsPage":
      return <MuscleList />;
    case "workoutsPage":
      return <WorkoutList />;
    case "createExercisePage":
      return <CreateExercise />;
    case "createWorkoutPage":
      return <CreateWorkout updateView={(page: string) => updateView(page)} />;
    case "loginPage":
      return <LoginPage updateView={(page: string) => updateView(page)} />;
    case "registerPage":
      return <RegisterPage updateView={(page: string) => updateView(page)} />;
    default:
      return <p> Default View </p>;
  }
};

export default Navbar;
