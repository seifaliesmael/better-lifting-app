import { View, Text, ActivityIndicator } from 'react-native';
import { equipmentTypes } from '../../Data/LocalData';
import { fetchAllExercises } from '../../api/dataServices';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { useContext } from 'react';
import { ListRender } from '@/components/Display/ListRender';

const ExerciseList = () => {
  const { data, isLoading, error } = fetchAllExercises();
  const { theme } = useContext(ThemeContext);

  if (isLoading) {
    return (
      <ActivityIndicator 
        size="large" 
        color="#0d6efd" 
        className="flex-1 justify-center items-center" 
      />
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-[#dc3545] text-base">Error: {error.message}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className={theme === 'dark' ? 'text-white' : 'text-[#212529]'}>
          No exercises found
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ListRender 
        data={data} 
        title="Exercises"
        renderData={(e) => (
          <View>
            <Text 
              className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-[#212529]'
              }`}
            >
              {e.exerciseName}
            </Text>
            
            <Text 
              className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-[#adb5bd]' : 'text-[#6c757d]'
              }`}
            >
              Equipment Type: {equipmentTypes[e.equipmentType]}
            </Text>
            
            <Text 
              className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-[#adb5bd]' : 'text-[#6c757d]'
              }`}
            >
              Muscle Groups:{'\n'}
              {e.muscleGroups && e.muscleGroups.length > 0 
                ? e.muscleGroups.map(m => m.name).join(", ") 
                : "No Muscle Groups Defined"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

export default ExerciseList;