import { router, Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import DarkModeButton from '@/components/ui/DarkModeButton';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/theme/ThemeContext';
import { Text } from "react-native";
import * as colors from "tailwindcss/colors";

// Navbar basically
export default function TabLayout() {

  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: colors.blue[600],
      tabBarInactiveTintColor: isLight ? colors.gray[400] : colors.slate[500],
      tabBarStyle: {
        backgroundColor: isLight ? colors.white : colors.slate[900],
        borderTopColor: isLight ? colors.gray[200] : colors.slate[800],
        borderTopWidth: 1,
      },
      headerShown: true, // Shows a title bar at the top of the screen
      headerRight: () => <DarkModeButton/>,
      headerStyle:{
        backgroundColor: isLight ? colors.white : colors.slate[900],
        borderBottomWidth: 1,
        borderBottomColor: isLight ? colors.gray[200] : colors.slate[800],
      },
      headerTitle: ({ children }) => (
        <Text className="text-gray-900 dark:text-white font-semibold text-lg">
          {children}
        </Text>
      ),
      sceneStyle: {
        backgroundColor: isLight ? colors.gray[50] : colors.slate[900]
      },
      headerShadowVisible: isLight
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
        name="tracker" 
        options={{ 
          title: 'Workout Tracker',
          tabBarIcon: ({ color }) => <FontAwesome name="plus" size={24} color={color} />
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