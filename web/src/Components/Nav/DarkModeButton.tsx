import { useContext } from "react";
import { ThemeContext } from "../../contexts/theme/ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";

const DarkModeButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      className="m-4 h-10 w-10 flex items-center justify-center rounded-lg bg-gray-300 dark:bg-slate-700 active:opacity-70 transition-colors"
      aria-label="Toggle theme"
      style={{cursor:"pointer"}}
    >
        {isLight ? (
            <FiMoon size={18} className="text-black" />
            ) : (
            <FiSun size={18} className="text-slate-300" />
        )}
    </button>
  );
};

export default DarkModeButton;