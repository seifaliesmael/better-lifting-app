import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { equipmentTypes } from '../../Data/LocalData';
import { fetchAllExercises } from '../../api/dataServices';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { useContext } from 'react';
import { ListRender } from '@/components/Display/ListRender';

const ExerciseList = () => {
  const { data, isLoading, error } = fetchAllExercises();
  const { theme } = useContext(ThemeContext);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0d6efd" style={styles.centered} />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={theme === 'dark' ? styles.textLight : styles.textDark}>
          No exercises found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ListRender 
        data={data} 
        title="Exercises"
        renderData={(e) => (
          <View>
            <Text style={[styles.title, theme === 'dark' ? styles.textLight : styles.textDark]}>
              {e.exerciseName}
            </Text>
            
            <Text style={[styles.subtitle, theme === 'dark' ? styles.textMutedDark : styles.textMutedLight]}>
              Equipment Type: {equipmentTypes[e.equipmentType]}
            </Text>
            
            <Text style={[styles.subtitle, theme === 'dark' ? styles.textMutedDark : styles.textMutedLight]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  errorText: {
    color: '#dc3545', // Bootstrap danger red
    fontSize: 16,
  },
  textLight: { color: '#ffffff' },
  textDark: { color: '#212529' },
  textMutedLight: { color: '#6c757d' },
  textMutedDark: { color: '#adb5bd' },
});

export default ExerciseList;