import type { WOResponse } from "../../Data/Responses";
import { useContext, useState } from "react";
import { ThemeContext } from "../../contexts/theme/ThemeContext";
import { useFetchWorkouts } from "../../api/dataServices";
import { checkLoggedIn } from "../../api/authServices";
import { ListRender } from "@/components/Display/ListRender";
import WorkoutDisplay from "@/components/Display/WorkoutDisplay";
import { ActivityIndicator, View, Text, Pressable } from "react-native";
import { CardTitle } from "@/components/ui/Card";

export const WorkoutsScreen = () => {
  const { data:loginData, isLoading:loginLoading } = checkLoggedIn();
  const [showWorkout, setShowWorkout] = useState<boolean>(false);
  const [currWorkout, setCurrWorkout] = useState<WOResponse | undefined>(
    undefined,
  );
  const { theme } = useContext(ThemeContext);

  const workoutListResponse = useFetchWorkouts(loginData?.email);

  const isLight = theme === "light";
  const textColor = isLight ? "text-black" : "text-white";
  const dividerColor = isLight ? "bg-gray-300" : "bg-gray-600";

  if (!loginData && !loginLoading) 
  {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className={`text-base ${textColor}`}>Not logged in.</Text>
      </View>
    );
  }
  if (workoutListResponse.isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0d6efd"
        className="flex-1 justify-center items-center"
      />
    );
  }
  if (workoutListResponse.error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-[#dc3545] text-base">
          Error: {workoutListResponse.error.message}
        </Text>
      </View>
    );
  }

  if (!workoutListResponse.data || workoutListResponse.data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className={theme === "dark" ? "text-white" : "text-[#212529]"}>
          No workout history found
        </Text>
      </View>
    );
  }

  console.log(JSON.stringify(workoutListResponse.data));

  const handleShow = () => {
    setShowWorkout(true);
  };

  return (
    <View className="flex-1">
      <WorkoutDisplay
        showWorkout={showWorkout}
        setShowWorkout={setShowWorkout}
        theme={theme}
        currWorkout={currWorkout}
      />
      <ListRender
        data={workoutListResponse.data}
        title="Workouts"
        onClick={(w) => {
          setCurrWorkout(w);
          handleShow();
        }}
        renderData={(w) => (
          <View>
            <CardTitle>{w.name}</CardTitle>

            {/* Horiontal Divider */}
            <View className={`divider ${dividerColor}`} />

            <View className="flex-row items-center justify-between mt-2">
              {/* Col equivalent */}
              <View className="flex-1">
                <Text className={`text-base ${textColor}`}>
                  Date: {new Date(w.start).toDateString()}
                </Text>
              </View>

              <View className="flex-1 items-end">
                <Pressable
                  className="bg-gray-500 px-4 py-2 rounded-lg active:bg-gray-600"
                  onPress={() => {
                    setCurrWorkout(w);
                    handleShow();
                  }}
                >
                  <Text className="text-white font-semibold">Show Details</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default WorkoutsScreen;
