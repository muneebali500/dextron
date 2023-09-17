import { createContext, useContext, useState } from "react";

const NotifyContext = createContext({});

const ToastContextProvider = ({ children }) => {
    const [state, setState] = useState({ isOpen: false, variant: "success", msg: "" });

    const setToast = (newData) => {
        setState({
            ...state,
            ...newData,
        });
    };

    return <NotifyContext.Provider value={{ ...state, setToast }}>{children}</NotifyContext.Provider>;
};

export const useToastContext = () => useContext(NotifyContext);

export default ToastContextProvider;
