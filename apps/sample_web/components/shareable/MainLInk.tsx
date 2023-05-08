import { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import { colors, medias } from "global-constants";

const MainLinkContainer = styled(Link)<{ $hoverScheme: "light" | "dark" }>`
  min-width: 120px;
  padding: 5px 20px;
  font-weight: 600;
  border-radius: 2px;
  transition: filter 300ms;
  &::selection {
    background-color: ${({ $hoverScheme }) => ($hoverScheme === "dark" ? colors.black : colors.white)};
    color: ${({ $hoverScheme }) => ($hoverScheme === "dark" ? colors.white : colors.black)};
  }
  @media screen and (min-width: ${`${medias.tablet + 1}px`}) {
    &:hover {
      filter: ${({ $hoverScheme }) => ($hoverScheme === "dark" ? "brightness(0.8)" : "brightness(1.2)")};
    }
  }
`;
interface MainLinkProps {
  children: string;
  href: string;
  style?: {
    color?: string;
    backgroundColor?: string;
  };
  target?: string;
  hoverScheme?: "light" | "dark";
}

const MainLink: FC<MainLinkProps> = ({
  children,
  hoverScheme = "dark",
  style = { color: colors.black, backgroundColor: colors.white },
  href,
  target = "_self",
}) => {
  return (
    <MainLinkContainer $hoverScheme={hoverScheme} style={style} href={href} target={target}>
      {children}
    </MainLinkContainer>
  );
};

export default MainLink;
