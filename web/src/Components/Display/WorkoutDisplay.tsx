import { type Dispatch, type SetStateAction } from "react";
import type { WOResponse } from "../../Data/Responses";
import { Card } from "../UI/Card";

interface Props {
  showWorkout: boolean;
  setShowWorkout: Dispatch<SetStateAction<boolean>>;
  currWorkout: WOResponse | undefined;
}

const WorkoutDisplay = ({
  showWorkout,
  setShowWorkout,
  currWorkout,
}: Props) => {
  const handleClose = () => {
    setShowWorkout(false);
  };

  if (!showWorkout) return null;

  return (
    // Overlay / Background - click to close modal
    <div
      className={"modal flex items-center justify-center bg-black/65 transition-opacity"}
      onClick={handleClose}
    >
      {/* Modal Container */}
      <div className="flex flex-col w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}> {/* This stops clicking inside the modal from closing it */}

        {/* Modal Header */}
        <div className="flex flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-0">
            {currWorkout?.name}
          </h2>
          <button 
            onClick={handleClose}
            style={{cursor:"pointer"}}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <span className="text-xl font-bold leading-none">✕</span>
          </button>
        </div>
        
        {/* Modal Body (Scrollable region) */}
        <div className="p-4 overflow-y-auto">
          
          {/* Notes Card */}
          {currWorkout?.notes ? (
            <Card className="mb-6 bg-gray-50 dark:bg-slate-800">
              <Card.Body>
                <Card.Title className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Notes
                </Card.Title>
                <Card.Text className="mb-0 text-gray-900 dark:text-white">
                  {currWorkout?.notes}
                </Card.Text>
              </Card.Body>
            </Card>
          ) : null}


          {/* Exercises */}
          {currWorkout?.workoutExercises.map((we, exIndex) => (
            <div key={exIndex} className={exIndex !== 0 ? "mt-4" : ""}>

              {/* Exercise name header */}
              <p className="text-lg font-bold mb-2 text-black dark:text-white"> 
                {we.exerciseName}
              </p>

              {/* Sets */}
              {we.workoutSets.map((set, setIndex) => (
                <div key={setIndex} className="p-3 mt-2 ml-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <p className="text-base font-semibold mb-2 text-black dark:text-white">
                    Set {setIndex + 1} 
                  </p>

                  <div className="flex flex-row">
                    <div className="flex-1">
                      <p className="text-black dark:text-white"> Reps: {set.reps} </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-black dark:text-white"> Weight: {set.weight} kg </p>
                    </div>
                    <div className="flex-1">
                      {set.rir ? (
                        <p className="text-black dark:text-white"> {"RIR: " + set.rir} </p>
                      ) : (
                        "RIR: N/A"
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 shrink-0 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleClose}
            style={{cursor:"pointer"}}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg active:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default WorkoutDisplay;
