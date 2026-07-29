import { LocalWorkoutExercise, LocalWorkoutSet } from "@/Data/LocalData";
import { Dispatch, SetStateAction, useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemeContext } from "@/contexts/theme/ThemeContext";

interface Props {
  workoutExercises: LocalWorkoutExercise[];
  setWorkoutExercises: Dispatch<SetStateAction<LocalWorkoutExercise[]>>;
  exIndex: number;
  set: LocalWorkoutSet;
  setIndex: number;
}

const setTypes = ["Warm-up Set", "Regular Set", "Drop Set"];

const SetDisplay = ({workoutExercises, setWorkoutExercises, exIndex, set, setIndex} : Props) => {

    const { theme} = useContext(ThemeContext);
    const isLight = theme === "light";

  // takes in an updateFn lambda function
  const updateSet = (
    exIndex: number,
    setIndex: number,
    updateFn: (prev: LocalWorkoutSet) => LocalWorkoutSet,
  ): void => {
    setWorkoutExercises((prev) => {
      const newExercises: LocalWorkoutExercise[] = [...workoutExercises];
      if (!newExercises[exIndex]) return prev;

      const oldEx: LocalWorkoutExercise = newExercises[exIndex];

      const newEx: LocalWorkoutExercise = {
        ...oldEx,
        workoutSets: [...oldEx.workoutSets],
      };

      newEx.workoutSets[setIndex] = updateFn(newEx.workoutSets[setIndex]);
      newExercises[exIndex] = newEx;

      return newExercises;
    });
  };

  const deleteSet = (exIndex: number, setIndex: number): void => {
    if (!workoutExercises) return;
    const newExercises = [...workoutExercises];
    if (!newExercises[exIndex]) return;

    const newEx: LocalWorkoutExercise = {
      ...newExercises[exIndex],
      workoutSets: newExercises[exIndex].workoutSets.filter(
        (_, index) => index != setIndex,
      ),
    };

    newExercises[exIndex] = newEx;
    setWorkoutExercises(newExercises);
  };

  // Move sets up/down by one
  const handleSetMove = (direction: "up" | "down") => {
    // Edge cases
    if (direction === "up" && setIndex === 0) return;
    if (
      direction === "down" &&
      setIndex === workoutExercises[exIndex].workoutSets.length - 1
    )
      return;

    setWorkoutExercises((prev) => {
      const newExercises = [...prev];
      const newEx = { ...newExercises[exIndex] };
      const newSets = [...newEx.workoutSets];

      // Swap with previous element
      if (direction === "up") {
        [newSets[setIndex], newSets[setIndex - 1]] = [
          newSets[setIndex - 1],
          newSets[setIndex],
        ];
      }
      // Swap with next element
      else {
        [newSets[setIndex], newSets[setIndex + 1]] = [
          newSets[setIndex + 1],
          newSets[setIndex],
        ];
      }

      newEx.workoutSets = newSets;
      newExercises[exIndex] = newEx;
      return newExercises;
    });
  };


  return (
    <View className="p-2 mt-2 ml-3 rounded-lg bg-gray-100 dark:bg-gray-700">
        {/* Header and up/down buttons */}
        <View className="flex flex-row items-center justify-between">
            <Text className="text-base text-black dark:text-white font-semibold"> Set {setIndex + 1} </Text>
            <View className="flex flex-row">
                <Pressable
                    className="self-end me-2"
                    onPress={() => handleSetMove("up")}
                > 
                    <Feather size={20} name="arrow-up" color={isLight ? "black" : "white"} />
                </Pressable>
                <Pressable
                    className="self-end me-4"
                    onPress={() => handleSetMove("down")}
                > 
                    <Feather size={20} name="arrow-down" color={isLight ? "black" : "white"}/>
                </Pressable>
            </View>
        </View>

        {/* Content */}
        <Text className="text-black dark:text-white"> Reps {set.reps} </Text>
        <Text className="text-black dark:text-white"> Weight {set.weight} </Text>
        <Text className="text-black dark:text-white"> RIR {set.rir} </Text>


    </View>
  )
}

export default SetDisplay