import { router } from 'expo-router';
import { checkLoggedIn } from '@/api/authServices';
import { ActivityIndicator, View, Text } from 'react-native';
import { useEffect } from 'react';

export default function Index() {
  const { data:isLoggedIn, isLoading } = checkLoggedIn();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/auth/login');
    }
  }, [isLoggedIn, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0d6efd" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-[32px] font-extrabold tracking-tight text-gray-900 dark:text-white mb-1">
        Welcome to MesoPal!
      </Text>
      <Text className="text-base text-gray-500 dark:text-slate-400 mb-6 mx-10">
        MesoPal is an open-source, hypertrophy-first lifting app and tracker designed to help you build muscle and plan your workouts.
      </Text>

    </View>
  );
}