import { useFetchExercises } from "@/api/dataServices";
import { ListRender } from "@/components/Display/ListRender";
import { equipmentTypes } from "@/Data/LocalData";
import { ExResponse } from "@/Data/Responses";
import { SetStateAction } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
} from "react-native"; // Removed ScrollView from imports

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<SetStateAction<boolean>>;
  addExercise: (ex: ExResponse) => void;
}

const AddExerciseDrawer = ({ visible, setVisible, addExercise }: Props) => {
  const handleClose = () => setVisible(false);
  const { data: exercises, isLoading, error } = useFetchExercises();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Modal Overlay / Backdrop */}
      <View className="flex-1 justify-center bg-black/50 p-4">
        {/* Modal Container */}
        <View
          className={`rounded-xl overflow-hidden bg-white dark:bg-gray-800`}
        >
          {/* Modal.Header */}
          <View
            className={`flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700`}
          >
            <Text className="text-xl font-bold text-black dark:text-white">
              Add an exercise
            </Text>

            {/* Close Button Equivalent */}
            <Pressable onPress={handleClose} className="p-1">
              <Text className="text-gray-500 text-lg font-bold">✕</Text>
            </Pressable>
          </View>

          {/* Modal.Body - Changed ScrollView to View */}
          <View className="p-4 h-[500px]">
            {/* Body */}
            {isLoading ? (
              <Text> Exercises loading </Text>
            ) : error ? (
              <Text> Error: {error.message} </Text>
            ) : !exercises ? (
              <Text> No exercises found. </Text>
            ) : (
              <View className="flex-1">
                <FlatList
                  data={exercises}
                  keyExtractor={(ex) => ex.id.toString()}
                  contentContainerClassName="px-5 pb-5"
                  renderItem={({ item: ex }) => (
                    <View
                      className={`mb-4 rounded-lg shadow-sm shadow-black/10 elevation-3 bg-gray-100 dark:bg-gray-700`}
                    >
                      <Pressable
                        onPress={() => {
                          addExercise(ex);
                          handleClose();
                        }}
                        className="p-4 rounded-lg active:opacity-70"
                      >
                        <View>
                          <Text className="text-xl font-bold mb-2 text-[#212529] dark:text-white">
                            {ex.exerciseName}
                          </Text>

                          <Text className="text-sm mt-1 text-[#6c757d] dark:text-[#adb5bd]">
                            Equipment Type: {equipmentTypes[ex.equipmentType]}
                          </Text>

                          <Text className="text-sm mt-1 text-[#6c757d] dark:text-[#adb5bd]">
                            Muscle Groups:{"\n"}
                            {ex.muscleGroups && ex.muscleGroups.length > 0
                              ? ex.muscleGroups.map((m) => m.name).join(", ")
                              : "No Muscle Groups Defined"}
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  )}
                />
              </View>
            )}
          </View>

          {/* Modal.Footer */}
          <View
            className={`p-4 border-t border-gray-200 dark:border-gray-700 flex-row justify-end`}
          >
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

export default AddExerciseDrawer;