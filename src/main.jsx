import { StrictMode, createContext, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

export let ThemeContext = createContext();
const ThemePro = ({children}) =>{
  const [isDark, setIsDark] = useState(false);
  const changeTheme = () => setIsDark((pre) => !pre);
  return (
    <ThemeContext.Provider value={{isDark,changeTheme}} >
      {children}
    </ThemeContext.Provider>
  )
}
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemePro>
      <App/>
    </ThemePro>
  </StrictMode>,
);
