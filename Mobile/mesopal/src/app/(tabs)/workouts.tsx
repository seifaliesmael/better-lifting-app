import { View, Text, StyleSheet } from 'react-native';

export default function WorkoutsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Workouts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});