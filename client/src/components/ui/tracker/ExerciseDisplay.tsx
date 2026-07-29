import { LocalWorkoutExercise, LocalWorkoutSet } from "@/Data/LocalData";
import React, { Dispatch, SetStateAction } from "react";
import { View, Text, Pressable } from "react-native";
import { Card } from "../Card";
import { Feather } from "@expo/vector-icons";
import SetDisplay from "./SetDisplay";
import { randomUUID } from "expo-crypto";

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
        id:randomUUID() // Unique IDs for sets - local only, for drag and drop purposesw TODO: remove if not necessary
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
      <Card.Body>
        <Text className="text-lg font-bold text-black dark:text-white"> {ex.exerciseName} </Text>
        
        {ex.workoutSets?.map((set, index) => (
          <SetDisplay key={set.id} workoutExercises={workoutExercises} setWorkoutExercises={setWorkoutExercises} exIndex={exIndex} set={set} setIndex={index}/>
        ))}

        {/* Exercise Buttons */}
        <View className="flex flex-row items-center mt-4">
          {/* Add set to Exercise */}
          <Pressable 
          className="bg-gray-300 w-fit px-3 py-2 mx-auto rounded-lg self-center"
          onPress={addSet}
          aria-label="Add set to session exercise">
            <Text className="text-base font-bold text-black"> Add Set </Text>
          </Pressable>

          {/* Delete exercise */}
          <Pressable 
          className="me-4 bg-red-500 p-2 rounded-lg self-center"
          onPress={deleteEx}
          aria-label="Delete session exercise">
            <Feather name="trash-2" color="white" size={20}/>
          </Pressable>
        </View>

      </Card.Body>
    </Card>
  );
};

export default ExerciseDisplay;
