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
    <View className="flex-1 justify-center items-center bg-gray-50">
      <Text className="text-[28px] font-bold mb-1">MesoPal</Text>
      <Text className="text-base italic text-gray-500">A better lifting app</Text>
    </View>
  );
}