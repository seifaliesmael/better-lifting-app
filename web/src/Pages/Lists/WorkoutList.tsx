import type { WOResponse } from "../../Data/Responses";
import { ListRender } from "../../Components/Display/ListRenderer";
import { useContext, useState } from "react";
import { ThemeContext } from "../../contexts/theme/ThemeContext";
import WorkoutDisplay from "../../Components/Display/WorkoutDisplay";
import { useFetchWorkouts } from "../../api/dataServices";
import { checkLoggedIn } from "../../api/authServices";
import { Card } from "../../Components/UI/Card";

const WorkoutList = () => {
  const { data:loginData, isLoading:loginLoading } = checkLoggedIn();
  const [showWorkout, setShowWorkout] = useState<boolean>(false);
  const [currWorkout, setCurrWorkout] = useState<WOResponse | undefined>(
    undefined,
  );
  const { theme } = useContext(ThemeContext);
  const workoutListResponse = useFetchWorkouts(loginData?.email);

  if (!loginData && !loginLoading) 
  {
    return (
      <div className="flex-1 justify-center items-center">
        <p className="text-base text-black dark:text-white">Not logged in.</p>
      </div>
    );
  }

  if (workoutListResponse.isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center mt-10">
        <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">Loading...</p>
      </div>
    );
  }

  if (workoutListResponse.error) {
    return (
      <div className="flex-1 justify-center items-center">
        <p className="text-[#dc3545] text-base">
          Error: {workoutListResponse.error.message}
        </p>
      </div>
    );
  }

  if (!workoutListResponse.data || workoutListResponse.data.length === 0) {
    return (
      <div className="flex-1 justify-center items-center">
        <p className="text-base text-black dark:text-white">
          No workout history found
        </p>
      </div>
    );
  }

  const handleShow = () => {
    setShowWorkout(true);
  };

return (
    <>
      <WorkoutDisplay 
        showWorkout={showWorkout} 
        setShowWorkout={setShowWorkout} 
        currWorkout={currWorkout}
      />
      <ListRender
        data={workoutListResponse.data}
        title="Past Workouts"
        rowHeight={150}
        renderData={(w) => (
          <div>
            <Card.Title>
              {w.name} 
            </Card.Title>
            
            <hr className="border-gray-200 dark:border-gray-700 my-2" />
            
            <div className="flex flex-row justify-between items-center mt-2">
              <div>
                <Card.Text className="mb-0">Date: {new Date(w.start).toDateString()}</Card.Text>
              </div>
              
              <div className="text-end">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg active:bg-gray-700 transition-colors"
                  style={{cursor:"pointer"}}
                  onClick={() => {
                    setCurrWorkout(w);
                    handleShow();
                  }}
                >
                  Show Details
                </button>
              </div>
            </div>
          </div>
        )}
      />
    </>
  );
}

export default WorkoutList;
