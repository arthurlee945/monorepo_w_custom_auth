import { FC, ReactNode } from "react";
import AuthContextProvider from "./AuthContext";
import GlobalStyleContextProvider from "./GlobalStyleContext";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import AuthModalContextProvider from "./AuthModalContext";

interface ContextContainerProps {
    children: ReactNode;
}

const ContextContainerProvider: FC<ContextContainerProps> = ({ children }) => {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}>
            <AuthContextProvider>
                <GlobalStyleContextProvider>
                    <AuthModalContextProvider>{children}</AuthModalContextProvider>
                </GlobalStyleContextProvider>
            </AuthContextProvider>
        </GoogleReCaptchaProvider>
    );
};

export default ContextContainerProvider;
