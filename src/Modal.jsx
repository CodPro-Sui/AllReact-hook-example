import { createPortal } from "react-dom"
import useTheme from "./useTheme"
const Modal = ({ cencel, children }) => {
  const {isDark} = useTheme();
  return createPortal(
    <div className={`dialog ${isDark? "darkD": ""}`} onClick={
      () => {
        cencel()
      }
    }>
      <div className="mess" onClick={(e) => e.stopPropagation()}>
        <span>{children}</span>
        <button onClick={cencel}>close</button>
      </div>
    </div>, document.body
  )
}

export default Modal