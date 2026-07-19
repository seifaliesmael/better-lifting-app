import { attemptLogin, attemptLogout } from "@/api/authServices";
import { Card } from "@/components/ui/Card";
import { ThemeContext } from "@/contexts/theme/ThemeContext";
import { router } from "expo-router";
import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const LogoutPage = () => {
  const { theme } = useContext(ThemeContext);
  const {mutate} = attemptLogout();

  const isLight = theme === "light";
  const textColor = isLight ? "text-black" : "text-white";

  const handleLogout = () => mutate();

  const logoutButton = (
    <Pressable
      className="bg-blue-600 w-full py-3 rounded-lg mt-4 mb-4 active:bg-blue-700"
      onPress={handleLogout}
    >
      <Text className="text-white text-center font-bold text-base">Log out</Text>
    </Pressable>
  );

  return (
      <Card className="w-full max-w-[400px] border-0">
        <Card.Body className="p-6">
          <Text className={`text-3xl font-bold text-center mb-6 ${textColor}`}>
            Logout
          </Text>

          <Text> Are you sure you wish to log out of MesoPal?</Text>
          {logoutButton}
        </Card.Body>
      </Card>
  );
};

export default LogoutPage;
