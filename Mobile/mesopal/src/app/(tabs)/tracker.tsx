import { Card } from "@/components/ui/Card";
import { LocalWorkoutExercise } from "@/Data/LocalData";
import { ThemeContext } from "@/contexts/theme/ThemeContext";
import { useContext, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useFetchExercises } from "@/api/dataServices";
import { ExResponse } from "@/Data/Responses";
import { randomUUID } from "expo-crypto";
import WorkoutTimer from "@/components/ui/tracker/WorkoutTimer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const tracker = () => {
  // Fetch required data
  const { theme } = useContext(ThemeContext);
  const exResponse = useFetchExercises();

  // States for tracking workout
  const [startTime, _] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState<
    LocalWorkoutExercise[]
  >([]);

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
  const textColor = isLight ? "text-black" : "text-white";
  const inputBg = isLight ? "bg-gray-50" : "bg-gray-800";
  const borderColor = isLight ? "border-gray-300" : "border-gray-600";

  return (
    <View className="flex-1 justify-center m-4">
      <Card className="align-middle h-[700px] gap-3">
        <Card.Body>
          <KeyboardAwareScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 16,
            }}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={20}
          >
            <Card.Title className="text-center">
              {workoutName ? workoutName : "Untitled Workout"}
            </Card.Title>
            <WorkoutTimer startTime={startTime} theme={theme} />

            {/* Workout name input */}
            <View className="mb-4 w-full">
                <Text className={`text-xs font-bold mb-2 text-black dark:text-white`}>
                Name this workout 
                </Text>
                <TextInput
                className={`border rounded-lg px-4 py-3 ${inputBg} ${borderColor} ${textColor}`}
                placeholder="Untitled workout"
                placeholderTextColor={isLight ? "#9ca3af" : "#6b7280"}
                value={workoutName}
                onChangeText={setWorkoutName}
                keyboardType="email-address"
                autoCapitalize="none"
                />
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
                keyboardType="email-address"
                autoCapitalize="none"
                />
            </View>

            <Text> My tracker page lmao </Text>
            <Text> My tracker page lmao </Text>
            <Text> My tracker page lmao </Text>
          </KeyboardAwareScrollView>
        </Card.Body>
      </Card>
    </View>
  );
};

export default tracker;
