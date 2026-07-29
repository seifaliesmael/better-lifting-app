import { Card } from "@/components/ui/Card";
import { LocalWorkoutExercise } from "@/Data/LocalData";
import { ThemeContext } from "@/contexts/theme/ThemeContext";
import { useContext, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useFetchExercises } from "@/api/dataServices";
import { ExResponse } from "@/Data/Responses";
import { randomUUID } from "expo-crypto";
import WorkoutTimer from "@/components/ui/tracker/WorkoutTimer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AddExerciseDrawer from "@/components/ui/tracker/AddExerciseDrawer";
import ExerciseDisplay from "@/components/ui/tracker/ExerciseDisplay";

const tracker = () => {
  // Fetch required data
  const { theme } = useContext(ThemeContext);
  const exResponse = useFetchExercises();

  // States for tracking workout
  const [startTime, _] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState<LocalWorkoutExercise[]>([]);
  const [exDrawerOpen, setExDrawerOpen] = useState<boolean>(false)


  if (exResponse.isLoading)
    return (
      <View className="flex-1 justify-center m-4">
        <Text className="text-center text-red-600 font-semibold">
          Fetching exercise options...
        </Text>
      </View>
    );
  if (exResponse.error)
    return (
      <View className="flex-1 justify-center m-4">
        <Text className="text-center text-red-600 font-semibold">
          Error: {exResponse.error.message}
        </Text>
      </View>
    );
  if (!exResponse.data)
    return (
      <View className="flex-1 justify-center m-4">
        <Text className="text-center text-red-600 font-semibold">
          No exercise options found in the database. Would you like to create a
          custom exercise?
        </Text>
      </View>
    );

  const addExercise = (ex: ExResponse): void => {
    const newWorkoutEx: LocalWorkoutExercise = {
      exerciseName: ex.exerciseName,
      order: workoutExercises ? workoutExercises.length : 0,
      exerciseId: ex.id,
      workoutSets: [],
      id: randomUUID(),
    };
    setWorkoutExercises((prev) => [...prev, newWorkoutEx]);
  };

  const isLight = theme === "light";
  const textColor = "text-black dark:text-white";
  const inputBg = "bg-gray-50 dark:bg-gray-800";
  const borderColor = "border-gray-300 dark:border-gray-600";

  const openExerciseDrawer = () => {setExDrawerOpen(true);}

  return (
    <View className="flex-1 m-4">

      {/* Add Exercise Drawer modal */}
      <AddExerciseDrawer 
      visible={exDrawerOpen}
      setVisible={setExDrawerOpen}
      addExercise={addExercise} />

      {/* Value Selection Modal */}
      

      {/* Content */}
      <Card className="align-middle flex-1 gap-3">
        <Card.Body className="flex-1"> 
          <KeyboardAwareScrollView
            style={{flex:1}}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              paddingHorizontal: 16,
              paddingBottom: 24,
            }}
            // removeClippedSubviews={false}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={20}
          >
            {/* Title and Notes */}
            <Card.Title className="text-center">
              {workoutName ? workoutName : "Untitled Workout"}
            </Card.Title>
            <WorkoutTimer startTime={startTime} />
            <Text className="text-center text-gray-500 dark:text-gray-400 font-semibold">
              {new Date(startTime).toDateString()}{" "}
            </Text>

            {/* Workout name input */}
            <View className="mb-4 w-full">
                <Text className={`text-sm font-bold mb-2 text-black dark:text-white`}>
                  Name this workout 
                </Text>

                <TextInput
                  className={`border rounded-lg px-5 py-4 text-base ${inputBg} ${borderColor} ${textColor}`}
                  placeholder="Untitled workout"
                  placeholderTextColor={isLight ? "#9ca3af" : "#6b7280"}
                  value={workoutName}
                  onChangeText={setWorkoutName}
                  keyboardType="default"
                  autoCapitalize="none"
                />

                <Text className={!workoutName ? "text-xs text-gray-500 dark:text-gray-400 mt-1" : "text-xs italic text-gray-500 dark:text-gray-400 mt-1"}>
                  Untitled workouts will be saved as the current date.
                </Text>
            </View>

            {/* Workout notes input */}
            <View className="mb-4 w-full">
                <Text className={`text-xs font-bold mb-2 text-gray-500 dark:text-gray-400`}>
                  Add notes to this workout (optional)
                </Text>
                <TextInput
                  className={`border rounded-lg px-4 py-3 ${inputBg} ${borderColor} ${textColor}`}
                  placeholder="None"
                  placeholderTextColor={isLight ? "#9ca3af" : "#6b7280"}
                  value={notes}
                  onChangeText={setNotes}
                  keyboardType="default"
                  autoCapitalize="none"
                />
            </View>

            {/* Current exercises */}
            {workoutExercises?.map((ex, index) => (
              <ExerciseDisplay
                key={ex.id}
                workoutExercises={workoutExercises}
                setWorkoutExercises={setWorkoutExercises}
                ex={ex}
                exIndex={index}
              />
            ))}

            {/* Add Exercise Button */}
            <Pressable 
            className="mt-4 p-2 rounded-lg bg-blue-500"
            onPress={() => openExerciseDrawer()}
            >
              <Text className="text-base text-gray-100 font-semibold">
                Add Exercise
              </Text>
            </Pressable>
          </KeyboardAwareScrollView>
        </Card.Body>
      </Card>
    </View>
  );
};

export default tracker;
