import { type Dispatch, type SetStateAction } from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { WOResponse } from '../../Data/Responses';

interface Props {
  showWorkout: boolean;
  setShowWorkout: Dispatch<SetStateAction<boolean>>;
  theme: string;
  currWorkout: WOResponse | undefined;
}

// Read-only counterpart to the tiles in the tracker's SetDisplay: caps label on
// top, big value underneath, em-dash when a value was never recorded.
const ReadOnlyTile = ({ label, value }: { label: string; value: string | null }) => (
  <View className="flex-1 items-center justify-center rounded-xl bg-white dark:bg-gray-800 px-2 py-3">
    <Text className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {label}
    </Text>
    <Text
      className={`mt-1 text-xl font-bold ${value === null ? 'text-gray-400 dark:text-gray-500' : 'text-black dark:text-white'}`}
      numberOfLines={1}
    >
      {value ?? '—'}
    </Text>
  </View>
);

const WorkoutDisplay = ({ showWorkout, setShowWorkout, theme, currWorkout }: Props) => {
  const handleClose = () => {
    setShowWorkout(false);
  };

  const isLight = theme === 'light';
  const iconColor = isLight ? '#374151' : '#e5e7eb';

  const start = currWorkout ? new Date(currWorkout.start) : null;
  const end = currWorkout ? new Date(currWorkout.end) : null;
  const durationMins =
    start && end ? Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000)) : null;

  return (
    <Modal
      visible={showWorkout}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Modal Overlay / Backdrop */}
      <View className="flex-1 justify-center bg-black/50 p-3">

        {/* Modal Container */}
        <View className={`rounded-2xl lg:w-[50vw] lg:self-center overflow-hidden bg-white dark:bg-gray-800`}>

          {/* Modal.Header */}
          <View className={`flex-row justify-between items-start px-5 py-4 border-b border-gray-200 dark:border-gray-700`}>
            <View className="flex-1 pr-2">
              <Text className="text-2xl font-bold text-black dark:text-white">
                {currWorkout?.name}
              </Text>
              {start ? (
                <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {start.toDateString()}
                  {durationMins !== null ? ` · ${durationMins} mins` : ''}
                </Text>
              ) : null}
            </View>

            {/* Close Button Equivalent */}
            <Pressable
              onPress={handleClose}
              className="h-11 w-11 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-700"
              aria-label="Close workout details"
            >
              <Feather name="x" size={24} color={iconColor} />
            </Pressable>
          </View>

          {/* Modal.Body wrapped in ScrollView for long content */}
          <ScrollView
            className="max-h-[65vh]"
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
          >

            {/* Notes Card */}
            {currWorkout?.notes ? (
              <View className="p-4 mb-5 rounded-2xl bg-gray-100 dark:bg-gray-700">
                <Text className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Notes
                </Text>
                <Text className="mt-1 text-base text-black dark:text-white">
                  {currWorkout?.notes}
                </Text>
              </View>
            ) : null}

            {/* Exercises Loop */}
            {currWorkout?.workoutExercises?.map((we, exIndex) => (
              <View key={exIndex} className={exIndex !== 0 ? 'mt-6' : ''}>
                <Text className="text-2xl font-bold text-black dark:text-white">
                  {we.exerciseName}
                </Text>
                <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {we.workoutSets?.length ?? 0}{' '}
                  {we.workoutSets?.length === 1 ? 'set' : 'sets'}
                </Text>

                {we.workoutSets?.map((set, setIndex) => (
                  <View key={setIndex} className="mt-3 p-4 rounded-2xl bg-gray-100 dark:bg-gray-700">
                    <Text className="text-lg font-bold mb-3 text-black dark:text-white">
                      Set {setIndex + 1}
                    </Text>

                    <View className="flex-row gap-2">
                      <ReadOnlyTile label="Reps" value={set.reps?.toString() ?? null} />
                      <ReadOnlyTile label="Weight (kg)" value={set.weight?.toString() ?? null} />
                      <ReadOnlyTile
                        label="RIR"
                        value={set.rir === undefined || set.rir === null ? null : set.rir.toString()}
                      />
                    </View>

                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          {/* Modal.Footer */}
          <View className={`px-5 py-4 border-t border-gray-200 dark:border-gray-700`}>
            <Pressable
              onPress={handleClose}
              className="w-full h-14 items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-600 active:opacity-70"
              aria-label="Close workout details"
            >
              <Text className="text-lg font-bold text-black dark:text-white">Close</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default WorkoutDisplay;
