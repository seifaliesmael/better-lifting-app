import CreateExercise from "../../Pages/Create/CreateExercise";
import CreateWorkout from "../../Pages/Create/CreateWorkout";
import ExerciseList from "../../Pages/Lists/ExerciseList";
import MuscleList from "../../Pages/Lists/MuscleList";
import WorkoutList from "../../Pages/Lists/WorkoutList";
import LoginPage from "../../Pages/Auth/LoginPage";
import RegisterPage from "../../Pages/Auth/RegisterPage";
import { attemptLogout, checkLoggedIn } from "../../api/authServices";

interface Props {
  updateView: (page: string) => void;
}

interface NavButtonProps {
  text: string;
  navTarget: string;
}

export const Navbar = ({ updateView }: Props) => {
  const NavButton = ({ text, navTarget }: NavButtonProps) => (
    <div>
      <button className={navButtonClass} onClick={() => updateView(navTarget)}>
        {text}
      </button>
    </div>
  );

  const authResponse = checkLoggedIn();
  const { mutate } = attemptLogout();
  const handleLogout = () => mutate({ updateView });

  if (authResponse.data) console.log("User is logged in: " + authResponse.data.email);

  const navButtonClass: string = "p-2 rounded-lg w-40 bg-gray-300 dark:bg-slate-700 text-black dark:text-white";

  return (
    <nav className="flex flex-col gap-4 mt-4">
        <NavButton text="View Exercises" navTarget="exercisesPage" />
        <NavButton text="View Workouts" navTarget="workoutsPage" />

        {/* Admin controls */}
        {authResponse.data?.email == "seifali.esmael@gmail.com" ? (
          <>
            <NavButton text="View Muscle Groups" navTarget="musclegroupsPage" />
            <NavButton
              navTarget="createExercisePage"
              text="Create New Exercise"
            />
          </>
        ) : null}

        <NavButton navTarget="createWorkoutPage" text="New Workout" />
        {authResponse.data ? (
          <div>
            <button
              className={navButtonClass}
              onClick={() => {
                handleLogout();
              }}
            >
              {" "}
              Log Out{" "}
            </button>
          </div>
        ) : (
          <>
            <NavButton text="Login" navTarget="loginPage" />
            <NavButton text="Register" navTarget="registerPage" />
          </>
        )}
    </nav>
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
