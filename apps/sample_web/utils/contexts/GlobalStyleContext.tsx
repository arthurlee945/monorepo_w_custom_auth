import { FC, ReactNode, createContext, useState } from "react";
import { GlobalStyles } from "../../styles/GlobalStyles";
import { LazyMotion, domAnimation } from "framer-motion";

interface GlobalStyleContextProps {
    children: ReactNode;
}

export const GlobalStyleContext = createContext({
    lockViewPort: false,
    setLockViewPort: (action: "lock" | "unlock" | "toggle") => {},
});

const GlobalStyleContextProvider: FC<GlobalStyleContextProps> = ({ children }) => {
    const [lock, setLock] = useState<boolean>(false);
    const setLockViewPort = (action: "lock" | "unlock" | "toggle") => {
        switch (action) {
            case "lock":
                setLock(true);
                break;
            case "unlock":
                setLock(false);
                break;
            case "toggle":
                setLock(!lock);
                break;
        }
    };
    const value = {
        lockViewPort: lock,
        setLockViewPort,
    };
    return (
        <GlobalStyleContext.Provider value={value}>
            <LazyMotion features={domAnimation}>
                <GlobalStyles $lockViewPort={lock} />
                {children}
            </LazyMotion>
        </GlobalStyleContext.Provider>
    );
};

export default GlobalStyleContextProvider;
