import { FC, ReactNode, createContext, useState } from "react";
import AuthModal from "../../components/components/AuthModalParts/AuthModal";

interface AuthModalContextProps {
    children: ReactNode;
}

export const AuthModalContext = createContext({
    showModal: false,
    setModalVisible: (action: "open" | "close" | "toggle") => {},
});

const AuthModalContextProvider: FC<AuthModalContextProps> = ({ children }) => {
    const [showModal, setShowModal] = useState(false);
    const setModalVisible = (action: "open" | "close" | "toggle") => {
        switch (action) {
            case "open":
                setShowModal(true);
                break;
            case "close":
                setShowModal(false);
                break;
            case "toggle":
                setShowModal(!showModal);
                break;
        }
    };
    const value = {
        showModal,
        setModalVisible,
    };
    return (
        <AuthModalContext.Provider value={value}>
            {showModal && (
                <AuthModal
                    closeModal={() => {
                        setModalVisible("close");
                    }}
                />
            )}
            {children}
        </AuthModalContext.Provider>
    );
};

export default AuthModalContextProvider;
