import "../global.css"; // For nativewind styling 
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/theme/ThemeContext';
import { configureReanimatedLogger } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient(); 
configureReanimatedLogger({
  strict:false
});

export default function RootLayout() {
  console.log('RootLayout render');
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}