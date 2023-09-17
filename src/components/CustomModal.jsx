import { useEffect } from "react";
import ClickAwayListener from "@helpers/ClickAwayListener";

// -------------- Custom Modal reusable ----------------
const CustomModal = ({ children, isOpen, onClose, className, fullScreen }) => {
  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove("stop-scroll");
      return;
    }
    document.body.classList.add("stop-scroll");
    return () => {
      document.body.classList.remove("stop-scroll");
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div
      className={`w-[100%] h-[100vh] bg-[#363636c4] fixed flex justify-center items-center top-0 bottom-0 ${
        fullScreen ? "p-0" : " py-3 px-2"
      } right-0 left-0 overflow-auto z-[999] backdrop-blur-[5px]`}
    >
      <ClickAwayListener
        onClickAway={() => onClose && onClose()}
        className={`overflow-auto bg-white rounded-lg my-auto ${
          className ? className : ""
        }`}
      >
        {children}
      </ClickAwayListener>
    </div>
  );
};

export default CustomModal;
