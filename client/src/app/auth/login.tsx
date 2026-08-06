import { useLoginAttempt } from "@/api/authServices";
import { useCheckServerStatus } from "@/api/dataServices";
import { Card } from "@/components/ui/Card";
import DarkModeButton from "@/components/ui/DarkModeButton";
import { ThemeContext } from "@/contexts/theme/ThemeContext";
import { router, Stack } from "expo-router";
import { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate, isPending, isError, error, reset } = useLoginAttempt();
  const { data: serverStatus, refetch: recheckServer } = useCheckServerStatus();
  const { theme } = useContext(ThemeContext);

  // Instead of sending the login attempt straight away, we queue it until the server is awake
  // If already awake, it just goes through straight away
  const [queued, setQueued] = useState<boolean>(false);

  // If server is asleep, we time out the request after 1.5 minutes.
  const [timedOut, setTimedOut] = useState<boolean>(false);

  const isLight = theme === "light";
  const textColor = isLight ? "text-black" : "text-white";
  const inputBg = isLight ? "bg-gray-50" : "bg-gray-800";
  const borderColor = isLight ? "border-gray-300" : "border-gray-600";
  const mutedText = isLight ? "text-gray-500" : "text-gray-400";

  const isSleeping = serverStatus === "sleeping";
  const isAwake = serverStatus === "awake";
  const busy = isPending || queued;

  // If server is awake and a login is queued, send it through.
  useEffect(() => {
    if (queued && isAwake) 
    {
      setQueued(false);
      mutate({ email, password });
    }
  }, [queued, isAwake]);

  // Start timer when we queue the login
  useEffect(() => {
    if (queued)
    {
      const timer = setTimeout(() => {
        setQueued(false); // Un-queue login once timed out, so user can try again later.
        setTimedOut(true);
      }, 1.5 * 60 * 1000); // 1.5 minute timout

      return () => clearTimeout(timer);
    }
  }, [queued]); // triggers when queued goes from false to true

  const handleLogin = () => {
    setTimedOut(false);
    if (!isAwake) 
      setQueued(true); // queue login if server not awake
    else
      mutate({ email, password }); // login directly otherwise
  };

  const errorMessage = timedOut
    ? "Server didn't respond after two minutes. Please try again shortly."
    : !isError || queued
      ? null
      : serverStatus === "serverError" || error.message.includes("NetworkError")
        ? "Couldn't reach server. Try again in 30s"
        : "Invalid username or password.";

  const loginButton = (
    <Pressable
      className={`w-full py-3 rounded-lg mt-4 mb-4 ${
        busy ? "bg-blue-400" : "bg-blue-600 active:bg-blue-700"
      }`}
      onPress={handleLogin}
      disabled={busy}
    >
      <View className="flex-row justify-center items-center">
        {busy ? (
          <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
        ) : null}
        <Text className="text-white text-center font-bold text-base">
          {queued
            ? "Waking up server..."
            : isPending
              ? "Logging in..."
              : "Log In"}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={20} 
      className="bg-[#ffffff] dark:bg-[#0f172a]"
    >

      <Stack.Screen options={{ 
        headerLeft: () => null,
        headerRight: () => <DarkModeButton/>,
        headerStyle:{backgroundColor: (isLight ? "#ffffff" : "#0f172a")},
        headerTitle: () => (
        <Text className="text-black dark:text-white font-semibold text-lg">
          Login
        </Text>
      )}} />

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
          {errorMessage ? (
            <Text className="text-red-500 text-sm mb-4">{errorMessage}</Text>
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

      <Card className="mt-4 w-fit">
        <Card.Body className="bg-gray-200 dark:bg-gray-600">
          <Text className="text-center"> This app has been deployed on a free tier server. {`\n`} As a result, if inactive for some time, the server may take a minute to wake up.  </Text>
        </Card.Body>
      </Card>
    </KeyboardAwareScrollView>
  );
};

export default LoginPage;
