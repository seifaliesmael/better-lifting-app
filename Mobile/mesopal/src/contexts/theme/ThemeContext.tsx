import { createContext, useState, type ReactNode } from "react";

interface ThemeData {
    theme:string;
    toggleTheme:() => void;
}

export const ThemeContext = createContext<ThemeData>({
    theme:"light",
    toggleTheme: () => {}
}); // Default context

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState("light");
    
    const toggleTheme = () => {
        console.log("Toggling theme");
        setTheme((prevTheme:string) => prevTheme === "dark" ? "light" : "dark");
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}