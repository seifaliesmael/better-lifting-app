import { LocalWorkoutExercise, LocalWorkoutSet } from "@/Data/LocalData";
import React, { Dispatch, SetStateAction, useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { Card } from "../Card";
import { Feather } from "@expo/vector-icons";
import SetDisplay from "./SetDisplay";
import { randomUUID } from "expo-crypto";
import { ThemeContext } from "@/contexts/theme/ThemeContext";

interface Props {
  workoutExercises: LocalWorkoutExercise[];
  setWorkoutExercises: Dispatch<SetStateAction<LocalWorkoutExercise[]>>;
  ex: LocalWorkoutExercise;
  exIndex: number;
}

const ExerciseDisplay = ({
  workoutExercises,
  setWorkoutExercises,
  ex,
  exIndex,
}: Props) => {
  const { theme } = useContext(ThemeContext);

  // Helper methods
  const deleteEx = (): void => {
    if (!workoutExercises) return;
    if (!workoutExercises[exIndex]) return;

    const newExercises = workoutExercises.filter(
      (_, index) => index != exIndex,
    );
    setWorkoutExercises(newExercises);
  };

  const addSet = (): void => {
    setWorkoutExercises((prev) => {
      const oldEx = prev[exIndex];
      if (!oldEx) return prev;

      const newSet: LocalWorkoutSet = {
        order: oldEx.workoutSets.length,
        weight: -1,
        reps: -1,
        type: 1, // Normal set by default 
        id:randomUUID() // Unique IDs for sets - local only, for drag and drop purposes TODO: remove if not necessary
      };

      const newExercises = [...prev];
      newExercises[exIndex] = {
        ...oldEx,
        workoutSets: [...oldEx.workoutSets, newSet],
      };

      return newExercises;
    });
  };


  return (
    <Card key={ex.id} className="w-full">
      <Card.Body className="p-5">
        <Text className="text-2xl font-bold text-black dark:text-white">
          {ex.exerciseName}
        </Text>
        <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {ex.workoutSets?.length ?? 0}{" "}
          {ex.workoutSets?.length === 1 ? "set" : "sets"}
        </Text>

        {ex.workoutSets?.map((set, index) => (
          <SetDisplay key={set.id} workoutExercises={workoutExercises} setWorkoutExercises={setWorkoutExercises} exIndex={exIndex} set={set} setIndex={index}/>
        ))}

        {/* Exercise Buttons */}
        <View className="flex flex-row items-center gap-3 mt-5">
          {/* Add set to Exercise */}
          <Pressable
          className="flex-1 flex-row items-center justify-center gap-2 h-14 rounded-xl bg-gray-200 dark:bg-gray-600 active:opacity-70"
          onPress={addSet}
          aria-label="Add set to session exercise">
            <Feather name="plus" size={20} color={theme === "light" ? "#111827" : "#ffffff"} />
            <Text className="text-base font-bold text-black dark:text-white"> Add Set </Text>
          </Pressable>

          {/* Delete exercise */}
          <Pressable
          className="h-14 w-14 items-center justify-center rounded-xl bg-red-500 active:opacity-70"
          onPress={deleteEx}
          aria-label="Delete session exercise">
            <Feather name="trash-2" color="white" size={22}/>
          </Pressable>
        </View>

      </Card.Body>
    </Card>
  );
};

export default ExerciseDisplay;
