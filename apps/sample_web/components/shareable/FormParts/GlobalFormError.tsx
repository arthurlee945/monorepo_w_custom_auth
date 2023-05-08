import { m } from "framer-motion";
import { FC } from "react";
import styled from "styled-components";
//-----------------custom
import { colors } from "global-constants";
import CloseIcon from "styles/icons/Close.svg";

const GlobalFormErrorContainer = styled(m.div)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    border: 2px solid ${colors.amber};
    border-radius: 5px;
    .error-text {
        color: ${colors.amber};
        font-size: 0.8rem;
        font-weight: 600;
    }
    .error-close-btn {
        width: 20px;
        aspect-ratio: 1/1;
        > svg {
            path {
                fill: ${colors.amber};
            }
        }
    }
`;

interface GlobalFormErrorProps {
    error: string;
    closeError: () => void;
}

const GlobalFormError: FC<GlobalFormErrorProps> = ({ error, closeError }) => {
    return (
        <GlobalFormErrorContainer initial={{ x: 15, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <p className="error-text">{error}</p>
            <button className="error-close-btn" onClick={closeError}>
                <CloseIcon />
            </button>
        </GlobalFormErrorContainer>
    );
};

export default GlobalFormError;
