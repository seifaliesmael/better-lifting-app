import { LocalWorkoutExercise, LocalWorkoutSet } from "@/Data/LocalData";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemeContext } from "@/contexts/theme/ThemeContext";
import ValueSelectorModal, { SelectorConfig } from "../ValueSelectorModal";

interface Props {
  workoutExercises: LocalWorkoutExercise[];
  setWorkoutExercises: Dispatch<SetStateAction<LocalWorkoutExercise[]>>;
  exIndex: number;
  set: LocalWorkoutSet;
  setIndex: number;
}

const repChoices = Array.from({ length: 30 }, (v, i) => (i)).map((num) => ({
  value: num,
  displayText: num === 1 ? `${num.toString()} rep` : `${num.toString()} reps`
}))

const weightChoices = Array.from({ length: 30 }, (v, i) => (2.5 * i)).map((num) => ({
  value: num,
  displayText: `${num.toString()} kg`
}))

const rirChoices = [
  { value: -1, displayText: "Untracked" }, // Default is -1 since RIR is optional, can be set to -1 to clear RIR saved value
  ...Array.from({ length: 11 }, (v, i) => (i)).map((num) => ({
    value: num,
    displayText: num === 0 ? "0 (to failure)" : num.toString()
  }))
]

const setTypes = ["Warm-up Set", "Regular Set", "Drop Set"];

// Blocks for Reps/Weight/RIR
interface TileProps {
  label: string;
  value: string | null;
  optional?: boolean;
  onPress: () => void;
}

const ValueTile = ({ label, value, optional = false, onPress }: TileProps) => {
  const isEmpty = value === null;
  const frame = optional && isEmpty
    ? "border-dashed border-gray-400 dark:border-gray-500 bg-transparent"
    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800";

  return (
    <Pressable
      className={`flex-1 min-h-[68px] items-center justify-center rounded-xl border px-2 py-3 active:opacity-60 ${frame}`}
      onPress={onPress}
      aria-label={`Select ${label.toLowerCase()}${optional ? " (optional)" : ""}`}
    >
      <Text className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </Text>

      {isEmpty ? (
        <Text
          className={`mt-1 text-gray-400 dark:text-gray-500 ${optional ? "text-sm italic" : "text-xl font-bold"}`}
          numberOfLines={1}
        >
          {optional ? "Optional" : "—"}
        </Text>
      ) : (
        <Text className="mt-1 text-xl font-bold text-black dark:text-white" numberOfLines={1}>
          {value}
        </Text>
      )}
    </Pressable>
  );
};

const SetDisplay = ({ workoutExercises, setWorkoutExercises, exIndex, set, setIndex }: Props) => {

  // Value selector state management
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selector, setSelector] = useState<SelectorConfig | null>(null);

  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
  const iconColor = isLight ? "#374151" : "#e5e7eb";

  const isFirst = setIndex === 0;
  const isLast = setIndex === workoutExercises[exIndex].workoutSets.length - 1;

  // takes in an updateFn lambda function
  const updateSet = (
    updateFn: (prev: LocalWorkoutSet) => LocalWorkoutSet,
  ): void => {
    setWorkoutExercises((prev) => {
      const newExercises: LocalWorkoutExercise[] = [...prev];
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

  const deleteSet = (): void => {
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
    if (direction === "up" && isFirst) return;
    if (direction === "down" && isLast) return;

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

  // Open the shared value picker with the given options
  const openSelector = (config: SelectorConfig) => {
    setSelector(config);
    setModalVisible(true);
  };

  return (
    <View>
      {/* // Modal for selecting values */}
      <ValueSelectorModal
        visible={modalVisible}
        setVisible={setModalVisible}
        items={selector ? selector.items : []}
        onSelect={selector ? selector.onSelect : (() => {})}
        />

      <View className="mt-3 rounded-2xl bg-gray-100 dark:bg-gray-700 p-4">

        {/* Header and up/down/delete buttons */}
        <View className="flex flex-row items-center justify-between mb-3">
          <Text className="text-lg text-black dark:text-white font-bold">
            Set {setIndex + 1}
          </Text>

          <View className="flex flex-row items-center">
            <Pressable
              className="h-11 w-11 items-center justify-center rounded-full active:bg-gray-200 dark:active:bg-gray-600"
              onPress={() => handleSetMove("up")}
              disabled={isFirst}
              aria-label="Move set up"
            >
              <Feather size={22} name="arrow-up" color={iconColor} style={{ opacity: isFirst ? 0.3 : 1 }} />
            </Pressable>

            <Pressable
              className="h-11 w-11 items-center justify-center rounded-full active:bg-gray-200 dark:active:bg-gray-600"
              onPress={() => handleSetMove("down")}
              disabled={isLast}
              aria-label="Move set down"
            >
              <Feather size={22} name="arrow-down" color={iconColor} style={{ opacity: isLast ? 0.3 : 1 }} />
            </Pressable>

            <Pressable
              className="h-11 w-11 items-center justify-center rounded-full active:bg-red-100 dark:active:bg-red-900"
              onPress={deleteSet}
              aria-label="Delete set"
            >
              <Feather size={20} name="trash-2" color="#ef4444" />
            </Pressable>
          </View>
        </View>

        {/* reps / weight / RIR pickers */}
        <View className="flex flex-row gap-2">
          <ValueTile
            label="Reps"
            value={set.reps === -1 ? null : set.reps.toString()}
            onPress={() =>
              openSelector({
                items: repChoices,
                onSelect: (picked) => updateSet((prev) => ({ ...prev, reps: picked.value })),
              })
            }
          />

          <ValueTile
            label="Weight (kg)"
            value={set.weight === -1 ? null : set.weight.toString()}
            onPress={() =>
              openSelector({
                items: weightChoices,
                onSelect: (picked) => updateSet((prev) => ({ ...prev, weight: picked.value })),
              })
            }
          />

          <ValueTile
            label="RIR"
            optional
            value={
              set.rir === undefined || set.rir === -1
                ? null
                : set.rir.toString()
            }
            onPress={() =>
              openSelector({
                items: rirChoices,
                onSelect: (picked) =>
                  updateSet((prev) => ({
                    ...prev,
                    rir: picked.value === -1 ? undefined : picked.value,
                  })),
              })
            }
          />
        </View>

      </View>
    </View>
  )
}

export default SetDisplay
