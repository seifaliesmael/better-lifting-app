import { type Dispatch, type SetStateAction } from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import type { WOResponse } from '../../Data/Responses';

interface Props {
  showWorkout: boolean;
  setShowWorkout: Dispatch<SetStateAction<boolean>>;
  theme: string;
  currWorkout: WOResponse | undefined;
}

const WorkoutDisplay = ({ showWorkout, setShowWorkout, theme, currWorkout }: Props) => {
  const handleClose = () => {
    setShowWorkout(false);
  };

  const isLight = theme === 'light';
  const cardBackground = isLight ? 'bg-gray-100' : 'bg-gray-800';
  const borderColor = isLight ? 'border-gray-200' : 'border-gray-700';

  return (
    <Modal
      visible={showWorkout}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Modal Overlay / Backdrop */}
      <View className="flex-1 justify-center bg-black/50 p-4">
        
        {/* Modal Container */}
        <View className={`rounded-xl px-4 overflow-hidden bg-white dark:bg-gray-800`}>
          
          {/* Modal.Header */}
          <View className={`flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700`}>
            <Text className="text-xl font-bold text-black dark:text-white">
              {currWorkout?.name}
            </Text>
            {/* Close Button Equivalent */}
            <Pressable onPress={handleClose} className="p-1">
              <Text className="text-gray-500 text-lg font-bold">✕</Text>
            </Pressable>
          </View>

          {/* Modal.Body wrapped in ScrollView for long content */}
          <ScrollView className="p-4 max-h-[70vh]">
            
            {/* Notes Card */}
            {currWorkout?.notes ? (
              <View className={`p-4 mb-4 rounded-lg ${cardBackground}`}>
                <Text className={`font-bold mb-1 text-black dark:text-white`}>Notes</Text>
                <Text className="text-black dark:text-white">{currWorkout?.notes}</Text>
              </View>
            ) : null}

            {/* Exercises Loop */}
            {currWorkout?.workoutExercises?.map((we, exIndex) => (
              <View key={exIndex} className={exIndex !== 0 ? 'mt-4' : ''}>
                <Text className={`text-lg font-bold mb-2 text-black dark:text-white`}>
                  {we.exerciseName}
                </Text>
                
                {we.workoutSets?.map((set, setIndex) => (
                  <View key={setIndex} className={`p-3 mt-2 ml-3 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                    <Text className={`text-base font-semibold mb-2 text-black dark:text-white`}>
                      Set {setIndex + 1}
                    </Text>
                    
                    <View className="flex-row">
                      <View className="flex-1">
                        <Text className="text-black dark:text-white">Reps: {set.reps}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-black dark:text-white">Weight: {set.weight} kg</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-black dark:text-white">
                          {set.rir ? `RIR: ${set.rir}` : 'RIR: N/A'}
                        </Text>
                      </View>
                    </View>

                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          {/* Modal.Footer */}
          <View className={`p-4 border-t ${borderColor} flex-row justify-end`}>
            <Pressable 
              onPress={handleClose} 
              className="bg-gray-500 px-4 py-2 rounded-lg active:bg-gray-600"
            >
              <Text className="text-white font-semibold">Close</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default WorkoutDisplay;