import { FC } from "react";
import styled from "styled-components";
import { colors, medias } from "global-constants";

const MainButtonContainer = styled.button<{ $colorScheme: "light" | "dark" }>`
    min-width: 120px;
    padding: 5px 20px;
    color: ${({ $colorScheme }) => ($colorScheme === "light" ? colors.black : colors.white)};
    background-color: ${({ $colorScheme }) => ($colorScheme === "light" ? colors.white : colors.black)};
    font-weight: 600;
    border-radius: 2px;
    transition: background-color 300ms;
    &:focus {
        outline: 2px solid ${({ $colorScheme }) => ($colorScheme === "light" ? colors.black : colors.white)};
    }
    @media screen and (min-width: ${`${medias.tablet + 1}px`}) {
        &:hover {
            background-color: ${({ $colorScheme }) => ($colorScheme === "light" ? colors.lightGrey : colors.darkGrey)};
        }
    }
`;
interface MainButtonProps {
    children: string;
    colorScheme?: "light" | "dark";
    onClick: () => void;
}

const MainButton: FC<MainButtonProps> = ({ children, colorScheme = "light", onClick }) => {
    return (
        <MainButtonContainer $colorScheme={colorScheme} onClick={onClick}>
            {children}
        </MainButtonContainer>
    );
};

export default MainButton;
