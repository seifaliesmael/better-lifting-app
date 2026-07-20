import { router, Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Navbar basically
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#0d6efd',
      headerShown: true // Shows a title bar at the top of the screen
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="workouts" 
        options={{ 
          title: 'Workouts',
          tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />
        }} 
      />
    <Tabs.Screen 
        name="exercises" 
        options={{ 
          title: 'Exercises',
          tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />
        }} 
      />
      <Tabs.Screen
      name="logout"
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Avoids being directed to (tabs)/logout.tsx which is blank
            router.push('/auth/logout');
          }
        }}
      options={{
        title: 'Logout',
        tabBarIcon: ({ color }) => <FontAwesome name="sign-out" size={24} color={color} />
      }}
    />
    </Tabs>
    
  );
}