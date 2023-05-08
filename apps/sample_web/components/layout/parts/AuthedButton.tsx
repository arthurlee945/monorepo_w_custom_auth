import { FC, useContext } from "react";
import styled from "styled-components";

import { trpc } from "../../../utils/trpc";
import { AuthContext } from "../../../utils/contexts/AuthContext";

const AuthedButtonContainer = styled.button`
    padding: 10px;
    border: 1px solid white;
`;

interface AuthedButtonProps {
    onClick: () => void;
}

const AuthedButton: FC<AuthedButtonProps> = ({ onClick }) => {
    const {
        authenticatedUser: { user },
    } = useContext(AuthContext);
    return (
        <AuthedButtonContainer type="button" role="button" aria-label="Authenticated User Profile Menu Button" onClick={onClick}>
            {user.username}
        </AuthedButtonContainer>
    );
};

export default AuthedButton;
