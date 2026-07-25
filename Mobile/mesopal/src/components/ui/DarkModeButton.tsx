import { ThemeContext } from "@/contexts/theme/ThemeContext";
import { useContext } from "react";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as colors from "tailwindcss/colors"
const DarkModeButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isLight = theme === "light";

  return (
    <Pressable
      onPress={toggleTheme}
      className="m-4 h-10 w-10 items-center justify-center rounded-lg bg-gray-200 dark:bg-slate-800 active:opacity-70"
    >

      <Feather name={isLight ? "moon" : "sun"} size={18} color={isLight ? colors.black : colors.slate[300]} />
    </Pressable>
  );
};

export default DarkModeButton;