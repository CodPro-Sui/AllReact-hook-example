import { useContext } from "react"
import { ThemeContext } from "./main"
const useTheme = () => {
    //useContext, createContext, custom hook use , light dark theme
  return useContext(ThemeContext)
}

export default useTheme