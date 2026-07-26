import { createContext, useEffect, useState, type ReactNode } from "react";

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

    // Set theme in the DOM
    useEffect(() => {
        console.log("Theme toggled");
        const root = document.documentElement; 

        // Sets <html data-theme=<theme>
        root.setAttribute('data-theme', theme);
    }, [theme]) // Trigger whenever theme is changed
    
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