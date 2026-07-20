import { useLoginAttempt } from "@/api/authServices";
import { Card } from "@/components/ui/Card";
import { ThemeContext } from "@/contexts/theme/ThemeContext";
import { router, Stack } from "expo-router";
import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate, isPending, isError } = useLoginAttempt();
  const { theme } = useContext(ThemeContext);

  const isLight = theme === "light";
  const textColor = isLight ? "text-black" : "text-white";
  const inputBg = isLight ? "bg-gray-50" : "bg-gray-800";
  const borderColor = isLight ? "border-gray-300" : "border-gray-600";
  const mutedText = isLight ? "text-gray-500" : "text-gray-400";

  const handleLogin = () => {
    if (isPending) console.log("Pending login attempt");
    console.log("Login attempted:", { email, password });
    mutate({ email, password });
  };

  const loginButton = (
    <Pressable
      className="bg-blue-600 w-full py-3 rounded-lg mt-4 mb-4 active:bg-blue-700"
      onPress={handleLogin}
    >
      <Text className="text-white text-center font-bold text-base">Log In</Text>
    </Pressable>
  );

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={20} 
    >

      <Stack.Screen options={{ 
        title: 'Login', 
        headerLeft: () => null
       }} />

      <Card className="w-full max-w-[400px] border-0">
        <Card.Body className="p-6">
          <Text className={`text-3xl font-bold text-center mb-6 ${textColor}`}>
            Login
          </Text>

          {/* Email Input */}
          <View className="mb-4">
            <Text className={`text-sm font-bold mb-2 ${mutedText}`}>
              Email address
            </Text>
            <TextInput
              className={`border rounded-lg px-4 py-3 ${inputBg} ${borderColor} ${textColor}`}
              placeholder="name@example.com"
              placeholderTextColor={isLight ? "#9ca3af" : "#6b7280"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className={`text-sm font-bold mb-2 ${mutedText}`}>
              Password
            </Text>
            <TextInput
              className={`border rounded-lg px-4 py-3 ${inputBg} ${borderColor} ${textColor}`}
              placeholder="Enter your password"
              placeholderTextColor={isLight ? "#9ca3af" : "#6b7280"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login error */}
          {isError ? (
            <Text className="text-red-500 text-sm mb-4">
              Invalid username or password.
            </Text>
          ) : null}

          {loginButton}

          {/* Footer link */}
          <View className="flex-row justify-center items-center">
            <Text className={`text-sm ${mutedText}`}>
              Don't have an account?{" "}
            </Text>
            <Pressable
              onPress={() => {
                router.replace("./register");
              }}
            >
              <Text className="text-blue-500 text-sm font-semibold">
                Sign up
              </Text>
            </Pressable>
          </View>
        </Card.Body>
      </Card>
    </KeyboardAwareScrollView>
  );
};

export default LoginPage;
