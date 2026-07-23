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
    <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-slate-900 px-6">
      <Text className="text-[32px] font-extrabold tracking-tight text-gray-900 dark:text-white mb-1">
        MesoPal
      </Text>
      <Text className="text-base italic text-gray-500 dark:text-slate-400 mb-6">
        A better lifting app
      </Text>

    </View>
  );
}