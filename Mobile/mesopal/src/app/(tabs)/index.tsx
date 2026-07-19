import { router } from 'expo-router';
import { checkLoggedIn } from '@/api/authServices';
import { ActivityIndicator, View, Text } from 'react-native';
import { useEffect } from 'react';

export default function Index() {
  const { data, isLoading } = checkLoggedIn();

  useEffect(() => {
    if (!isLoading && !data) {
      router.replace('/auth/login');
    }
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0d6efd" />
      </View>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <View className="flex-1 justify-center items-center p-6">
      <Text className="text-lg font-semibold">Welcome back</Text>
    </View>
  );
}