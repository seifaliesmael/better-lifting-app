import { Card } from "@/components/ui/Card";
import { LocalWorkoutExercise } from "@/Data/LocalData";
import { ThemeContext } from "@/contexts/theme/ThemeContext";
import { useContext, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCreateWorkout, useFetchExercises } from "@/api/dataServices";
import { ExResponse } from "@/Data/Responses";
import { randomUUID } from "expo-crypto";
import WorkoutTimer from "@/components/ui/tracker/WorkoutTimer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AddExerciseDrawer from "@/components/ui/tracker/AddExerciseDrawer";
import ExerciseDisplay from "@/components/ui/tracker/ExerciseDisplay";
import { exerciseReady } from "@/Utilities/workoutUtils";
import { WORequest } from "@/Data/Requests";

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

  // Mutations
  const {mutate:pushWorkoutPayload} = useCreateWorkout();


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

  // Same readiness rule as the web app: at least one exercise, and every exercise
  // has at least one set with reps + weight filled in.
  const workoutReady =
    workoutExercises.length >= 1 && !workoutExercises.some((ex) => !exerciseReady(ex));

  // Why the save button is greyed out
  const notReadyHint =
    workoutExercises.length < 1
      ? "Add an exercise to save this workout."
      : "Every set needs reps and weight before saving.";

  const saveWorkout = async () => {
    // TODO - make helper to convert.
    const payload: WORequest = {
      name: workoutName
        ? workoutName
        : `Untitled Workout [${startTime.toDateString()}]`,
      notes: notes,
      start: startTime,
      end: new Date(),
      workoutExercises: workoutExercises.map(
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

    pushWorkoutPayload(payload);
  };

  return (
    <View className="flex-1 m-2">

      {/* Add Exercise Drawer modal */}
      <AddExerciseDrawer 
      visible={exDrawerOpen}
      setVisible={setExDrawerOpen}
      addExercise={addExercise} />

      {/* Content */}
      <Card className="align-middle flex-1 gap-3">
        <Card.Body className="flex-1 px-2">
          <KeyboardAwareScrollView
            style={{flex:1}}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              paddingHorizontal: 8,
              paddingBottom: 32,
            }}
            // removeClippedSubviews={false}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={20}
          >
            {/* Title and Notes */}
            <Card.Title className="text-center text-3xl mb-3">
              {workoutName ? workoutName : "Untitled Workout"}
            </Card.Title>
            <WorkoutTimer startTime={startTime} />
            <Text className="text-center text-base text-gray-500 dark:text-gray-400 font-semibold mt-2 mb-5">
              {new Date(startTime).toDateString()}{" "}
            </Text>

            {/* Workout name input */}
            <View className="mb-5 w-full">
                <Text className={`text-base font-bold mb-2 text-black dark:text-white`}>
                  Name this workout
                </Text>

                <TextInput
                  className={`border rounded-xl px-5 h-14 text-lg ${inputBg} ${borderColor} ${textColor}`}
                  placeholder="Untitled workout"
                  placeholderTextColor={isLight ? "#9ca3af" : "#6b7280"}
                  value={workoutName}
                  onChangeText={setWorkoutName}
                  keyboardType="default"
                  autoCapitalize="none"
                />

                <Text className={!workoutName ? "text-sm text-gray-500 dark:text-gray-400 mt-2" : "text-sm italic text-gray-500 dark:text-gray-400 mt-2"}>
                  Untitled workouts will be saved as the current date.
                </Text>
            </View>

            {/* Workout notes input */}
            <View className="mb-5 w-full">
                <Text className={`text-base font-bold mb-2 text-gray-500 dark:text-gray-400`}>
                  Add notes to this workout (optional)
                </Text>
                <TextInput
                  className={`border rounded-xl px-5 py-4 text-lg min-h-[64px] ${inputBg} ${borderColor} ${textColor}`}
                  multiline={true}
                  textAlignVertical="top"
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
            className="mt-4 w-full h-14 flex-row items-center justify-center gap-2 rounded-xl bg-blue-500 active:opacity-80"
            onPress={() => openExerciseDrawer()}
            aria-label="Add exercise to workout"
            >
              <Feather name="plus" size={22} color="#f3f4f6" />
              <Text className="text-lg text-gray-100 font-bold">
                Add Exercise
              </Text>
            </Pressable>

            {/* Save Workout Button */}
            <Pressable
            className={`mt-3 w-full h-14 flex-row items-center justify-center gap-2 rounded-xl ${
              workoutReady
                ? "bg-green-600 active:opacity-80"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            disabled={!workoutReady}
            onPress={saveWorkout}
            aria-label="Save workout"
            >
              <Feather
                name="check"
                size={22}
                color={workoutReady ? "#f3f4f6" : isLight ? "#9ca3af" : "#6b7280"}
              />
              <Text
                className={`text-lg font-bold ${
                  workoutReady ? "text-gray-100" : "text-gray-400 dark:text-gray-500"
                }`}
              >
                Save Workout
              </Text>
            </Pressable>

            {!workoutReady && (
              <Text className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                {notReadyHint}
              </Text>
            )}
          </KeyboardAwareScrollView>
        </Card.Body>
      </Card>
    </View>
  );
};

export default tracker;
