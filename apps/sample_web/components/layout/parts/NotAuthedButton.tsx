import { colors } from "global-constants";
import { FC } from "react";
import styled from "styled-components";
import DetectiveIcon from "styles/icons/DetectiveIcon.svg";

const ProfileButtonContainer = styled.button`
    z-index: 3;
    width: 35px;
    aspect-ratio: 1/1;
    padding: 2px;
    border-radius: 5px;
    &:hover {
        svg {
            transform: rotate(20deg) translateY(-10%);
        }
    }
    &:focus {
        outline: 1px solid ${colors.white};
    }
    &:active {
        svg {
            transform: rotate(0deg) translateY(0);
        }
    }
    svg {
        transition: transform 300ms;
        transform-origin: 25% 75%;
    }
    path {
        fill: ${colors.white};
        stroke-dasharray: 1000px;
    }
`;

interface NotAuthedButtonProps {
    onClick: () => void;
}

const NotAuthedButton: FC<NotAuthedButtonProps> = ({ onClick }) => {
    return (
        <ProfileButtonContainer type="button" role="button" aria-label="Not Authenticated User Profile Menu Button" onClick={onClick}>
            <DetectiveIcon />
        </ProfileButtonContainer>
    );
};

export default NotAuthedButton;
