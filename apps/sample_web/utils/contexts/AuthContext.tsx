import { createContext, useState, FC, ReactNode } from "react";
import { authedUser } from "trpc-api/src/router/procedures/authProcedures";
import { trpc } from "../trpc";

interface AuthContextProps {
    authenticatedUser: {
        authenticated: boolean;
        user: Partial<authedUser>;
    };
    revalidateAuth: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
    authenticatedUser: {
        authenticated: false,
        user: {},
    },
    revalidateAuth: () => {},
});

interface AuthContextProviderProps {
    children: ReactNode;
}

const AuthContextProvider: FC<AuthContextProviderProps> = ({ children }) => {
    const [authenticatedUser, setauthenticatedUser] = useState({
        authenticated: false,
        user: {},
    });
    const { refetch } = trpc.auth.authVerify.useQuery(undefined, {
        onSuccess: (data) => {
            setauthenticatedUser((curr) => ({
                ...curr,
                ...data,
            }));
        },
        onError: () => {
            setauthenticatedUser((curr) => ({
                ...curr,
                authenticated: false,
                user: {},
            }));
        },
    });
    const revalidateAuth = () => refetch();
    const value = {
        authenticatedUser,
        revalidateAuth,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
