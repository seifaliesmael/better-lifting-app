// import { Button, Dropdown } from "react-bootstrap";
import { LocalWorkoutExercise } from "@/Data/LocalData";
import { WORequest } from "@/Data/Requests";
import { ExResponse } from "@/Data/Responses";
import { exerciseReady } from "@/Utilities/workoutUtils";
import { useCreateWorkout } from "@/api/dataServices";
import { ThemeContext } from "@/contexts/theme/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { Pressable, View, Text, Modal } from "react-native";

interface AddExerciseProps {
  data: ExResponse[] | undefined;
  addExercise: (ex: ExResponse) => void;
}

// Add a new exercise to a workout
export const AddExerciseButton = ({ data, addExercise }: AddExerciseProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { theme } = useContext(ThemeContext);

  if (!data) return (
    <Pressable>
      <Text> No exercise options. </Text>
    </Pressable>
  )

  const handleSelectExercise = (ex:ExResponse): void => {
    addExercise(ex);
    setModalVisible(false);
  }

  return (
    <View>
      {/* Add exercise (modal trigger) button */}
      <Pressable 
      className="bg-blue-500 active:bg-blue-700 rounded-[18px] px-3 py-2 mt-2"
      onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-semibold text-base"> Add Exercise </Text>
      </Pressable>

      {/* Modal -> Exercise select list */}
      <Modal 
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      transparent={true}
      >
        {/* Full viewport that pushes drawer to bottom */}
        <View className="flex-1 justify-end">

          {/*  Drawer with selection */}
          <View className="h-3/4 bg-white dark:bg-slate-900 rounded-3xl border-[2px] border-gray-300 dark:border-gray-800">
            
            {/* Top elements - title and close button */}
            <View className="w-full flex-row justify-between">
              <Text className="mx-8 my-4 text-end text-black dark:text-white text-2xl font-semibold">
                Select an Exercise
              </Text>
              {/* Close Button */}
              <Pressable className="m-4" onPress={() => setModalVisible(false)}> 
                <Feather name="x" size={25}/>
              </Pressable>
            </View>

          </View>

        </View>


      </Modal>
    </View>
  )

}

interface SaveWorkoutProps {
  wkExercises: LocalWorkoutExercise[];
  workoutName: string;
  notes?: string;
  startTime: Date;
  resetFields: () => void;
}
// Save workout and push to DB
export const SaveWorkoutButton = ({
  wkExercises,
  workoutName,
  notes,
  startTime,
  resetFields,
}: SaveWorkoutProps) => {
  // Function to push workout to DB and reset fields
  const pushPayload = async (exercises: LocalWorkoutExercise[]) => {
    const payload: WORequest = {
      name: workoutName
        ? workoutName
        : `Untitled Workout [${startTime.toDateString()}]`,
      notes: notes,
      start: startTime,
      end: new Date(),
      workoutExercises: exercises.map(
        ({ exerciseName, id, workoutSets, ...rest }, index) => ({
          ...rest,
          order: index,
          workoutSets: workoutSets.map((set, index) => ({
            ...set,
            order: index,
          })),
        }),
      ),
    };

    console.log("Creating resource:", JSON.stringify(payload));

    try {
      await useCreateWorkout(payload);
      resetFields();
    } catch (err) {
      console.error("Failed to create exercise", err);
    }
  };

  if (!wkExercises) return;
  const workoutReady =
    wkExercises.length >= 1 && !wkExercises.some((ex) => !exerciseReady(ex));

  return (
    <Pressable
      disabled={!workoutReady}
      className="bg-green-600 mt-4 ms-2 "
      onPress={() => pushPayload(wkExercises)}
    >
      Finish Workout
    </Pressable>
  );
};
