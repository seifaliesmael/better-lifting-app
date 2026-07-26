import { useLogout } from "@/api/authServices";
import { Card } from "@/components/ui/Card";
import { ThemeContext } from "@/contexts/theme/ThemeContext";
// 1. Import Stack and View
import { router, Stack } from "expo-router"; 
import { View, Text, Pressable } from "react-native";
import { useContext } from "react";
import DarkModeButton from "@/components/ui/DarkModeButton";

const LogoutPage = () => {
  const { theme } = useContext(ThemeContext);
  const { mutate:logout } = useLogout();

  const isLight = theme === "light";
  const textColor = isLight ? "text-black" : "text-white";
  
  const bgColor = isLight ? "bg-gray-100" : "bg-gray-900";

  const logoutButton = (
    <Pressable
      className="bg-blue-600 w-full py-3 rounded-lg mt-4 active:bg-blue-700"
      onPress={() => logout()}
    >
      <Text className="text-white text-center font-bold text-base">Log Out</Text>
    </Pressable>
  );

  const backButton = (
    <Pressable
    className="bg-gray-100 w-full py-3 rounded-lg mt-4 border border-gray-200 active:bg-gray-200"
    onPress={() => router.back()}
    >
      <Text className="text-blue-600 text-center font-bold text-base"> Back </Text> 
    </Pressable>
  )

  return (
    <View className={`flex-1 justify-center items-center px-4 ${bgColor}`}>
      
      <Stack.Screen options={{ 
        headerLeft: () => null,
        headerRight: () => <DarkModeButton/>,
        headerStyle:{backgroundColor: (isLight ? "#ffffff" : "#0f172a")},
        headerTitle: () => (
        <Text className="text-black dark:text-white font-semibold text-lg">
          Log Out
        </Text>
      )}} />

      <Card className="w-full max-w-[400px] border-0 shadow-sm">
        <Card.Body className="p-6">
          <Text className={`text-3xl font-bold text-center mb-6 ${textColor}`}>
            Log Out
          </Text>

          <Text className={`text-center text-base mb-4 ${textColor}`}>
            Are you sure you wish to log out of MesoPal?
          </Text>
          
          {logoutButton}
          {backButton}
        </Card.Body>
      </Card>
      
    </View>
  );
};

export default LogoutPage;