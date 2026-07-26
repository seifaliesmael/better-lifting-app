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
      className="m-4 h-10 w-10 flex items-center justify-center rounded-lg bg-gray-300 dark:bg-slate-700 active:opacity-70 transition-colors"
      aria-label="Toggle theme"
    >
      <Feather name={isLight ? "moon" : "sun"} size={18} color={isLight ? colors.black : colors.slate[300]} />
    </Pressable>
  );
};

export default DarkModeButton;