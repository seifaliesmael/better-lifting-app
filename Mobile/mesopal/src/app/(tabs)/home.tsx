import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <Text className="text-[28px] font-bold mb-1">MesoPal</Text>
      <Text className="text-base italic text-gray-500">A better lifting app</Text>
    </View>
  );
}