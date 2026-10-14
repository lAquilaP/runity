
import React, {
  createContext,
  useContext,
  useState,
} from "react";

import { useColorScheme } from "react-native";
import { colors } from "./colors";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemTheme = useColorScheme();
  const [preference, setPreference] = useState("system");

  const mode =
    preference === "system"
      ? systemTheme === "dark"
        ? "dark"
        : "light"
      : preference;

  const theme = colors[mode];

  const changeTheme = () => {
    setPreference(mode === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        preference,
        setPreference,
        changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useAppTheme deve ser usado dentro de ThemeProvider"
    );
  }

  return context;
}
